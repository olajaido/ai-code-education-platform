// module.exports = async function (context, req) {
//     context.log('JavaScript HTTP trigger function processed a request.');

//     const code = req.body?.code;
//     const language = req.body?.language || 'javascript';
//     const testCases = req.body?.testCases || [];

//     if (!code) {
//         context.res = {
//             status: 400,
//             body: { error: "Please provide code to execute" }
//         };
//         return;
//     }

//     try {
//         // For JavaScript execution in a somewhat safer manner
//         // Note: In production, you'd want to use a proper sandboxed environment
//         const results = [];
        
//         if (testCases.length > 0) {
//             // Execute with test cases
//             for (const test of testCases) {
//                 try {
//                     // Create a safe execution environment
//                     const executionFunction = new Function('input', `
//                         ${code}
                        
//                         // Assuming the last function in the code is the one to test
//                         const functionName = Object.keys(this).pop();
//                         return eval(functionName)(input);
//                     `);
                    
//                     const output = executionFunction(test.input);
//                     const passed = JSON.stringify(output) === JSON.stringify(test.expected);
                    
//                     results.push({
//                         input: test.input,
//                         expected: test.expected,
//                         output: output,
//                         passed: passed
//                     });
//                 } catch (testError) {
//                     results.push({
//                         input: test.input,
//                         expected: test.expected,
//                         error: testError.message,
//                         passed: false
//                     });
//                 }
//             }
//         } else {
//             // Just execute the code with no specific test cases
//             const executionFunction = new Function(`
//                 ${code}
                
//                 // Return the last expression's value if possible
//                 return eval(Object.keys(this).pop());
//             `);
            
//             const output = executionFunction();
//             results.push({ output });
//         }

//         // Send back the execution results
//         context.res = {
//             status: 200,
//             body: {
//                 results,
//                 success: true,
//                 language
//             }
//         };
//     } catch (err) {
//         context.log.error('Execution error:', err);
//         context.res = {
//             status: 400,
//             body: {
//                 error: "Code execution failed",
//                 message: err.message,
//                 success: false
//             }
//         };
//     }
// };

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const code = req.body?.code;
    const language = req.body?.language || 'javascript';
    const testCases = req.body?.testCases || [];

    if (!code) {
        context.res = {
            status: 400,
            body: { error: "Please provide code to execute" }
        };
        return;
    }

    try {
        // For JavaScript execution with improved safety
        const results = [];
        
        if (testCases.length > 0) {
            // Execute with test cases
            for (const test of testCases) {
                try {
                    // Sandbox the execution in a safer way
                    const sandboxCode = `
                        ${code}
                        
                        // Safely determine the function name
                        const functionNames = [];
                        for (const key in this) {
                            if (typeof this[key] === 'function' && (this[key].toString().includes('=>') || 
                                this[key].toString().includes('function'))) {
                                functionNames.push(key);
                            }
                        }
                        
                        // Use the most recently defined function
                        const targetFunction = functionNames[functionNames.length - 1];
                        
                        // Execute and return the result
                        return this[targetFunction](${JSON.stringify(test.input)});
                    `;
                    
                    // Execute the code
                    const executionFunction = new Function(sandboxCode);
                    const output = executionFunction();
                    
                    // Compare results - handle different types correctly
                    let passed = false;
                    
                    if (typeof output === 'object' && output !== null) {
                        passed = JSON.stringify(output) === JSON.stringify(test.expected);
                    } else if (typeof output === 'string' && typeof test.expected === 'string') {
                        // For string comparisons, normalize whitespace
                        passed = output.trim().replace(/\\s+/g, ' ') === 
                                test.expected.trim().replace(/\\s+/g, ' ');
                    } else {
                        passed = output === test.expected;
                    }
                    
                    results.push({
                        input: test.input,
                        expected: test.expected,
                        output: output,
                        passed: passed
                    });
                } catch (testError) {
                    context.log.error('Test execution error:', testError);
                    results.push({
                        input: test.input,
                        expected: test.expected,
                        error: testError.message,
                        passed: false
                    });
                }
            }
        } else {
            // Just execute the code with no specific test cases
            try {
                const sandboxCode = `
                    ${code}
                    
                    // Try to find the main function or return a simple evaluation
                    try {
                        const functionNames = [];
                        for (const key in this) {
                            if (typeof this[key] === 'function' && 
                                (this[key].toString().includes('=>') || this[key].toString().includes('function'))) {
                                functionNames.push(key);
                            }
                        }
                        
                        if (functionNames.length > 0) {
                            // Return the result of the last defined function with no args
                            return this[functionNames[functionNames.length - 1]]();
                        } else {
                            // If no function found, just evaluate the code
                            return eval(\`${code.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`);
                        }
                    } catch (e) {
                        return "Code executed but returned no output: " + e.message;
                    }
                `;
                
                const executionFunction = new Function(sandboxCode);
                const output = executionFunction();
                
                results.push({ 
                    output: output,
                    passed: true
                });
            } catch (execError) {
                context.log.error('Execution error:', execError);
                results.push({ 
                    error: execError.message,
                    passed: false
                });
            }
        }

        // Calculate overall success
        const allPassed = results.every(result => result.passed);

        // Add AI feedback for failed tests (optional feature - not connecting to Azure OpenAI here)
        const resultsWithFeedback = results.map(result => {
            if (!result.passed && result.error) {
                return {
                    ...result,
                    feedback: generateErrorFeedback(result.error)
                };
            }
            return result;
        });

        context.res = {
            status: 200,
            body: {
                results: resultsWithFeedback,
                success: allPassed,
                language
            }
        };
    } catch (err) {
        context.log.error('Execution error:', err);
        context.res = {
            status: 400,
            body: {
                error: "Code execution failed",
                message: err.message,
                success: false
            }
        };
    }
};

// Helper function to generate helpful feedback for common errors
function generateErrorFeedback(errorMessage) {
    if (errorMessage.includes('is not defined')) {
        return `It looks like you're using a variable or function that hasn't been defined yet. Check for typos or make sure to declare all variables before using them.`;
    } else if (errorMessage.includes('is not a function')) {
        return `You're trying to call something as a function, but it's not actually a function. Check that you've defined your function correctly and are calling it with the right name.`;
    } else if (errorMessage.includes('Cannot read property')) {
        return `You're trying to access a property of an undefined or null value. Make sure your objects are initialized before accessing their properties.`;
    } else if (errorMessage.includes('Unexpected token')) {
        return `There's a syntax error in your code. Check for mismatched brackets, missing semicolons, or other syntax issues.`;
    } else {
        return `There was an error in your code. Try reviewing your logic and syntax to identify the issue.`;
    }
}