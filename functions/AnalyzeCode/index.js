module.exports = async function (context, req) {
    context.log('Code analysis function processed a request.');

    const code = req.body?.code;
    const analysisType = req.body?.type || 'general';
    const challengeTitle = req.body?.challengeTitle || 'coding challenge';
    
    if (!code) {
        context.res = {
            status: 400,
            body: { error: "Please provide code to analyze" }
        };
        return;
    }

    try {
        // Check for environment variables
        const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
        const apiKey = process.env.AZURE_OPENAI_API_KEY;
        const deploymentName = process.env.AZURE_OPENAI_DEPLOYMENT_NAME;
        
        // Log the environment variable status (don't log the actual key)
        context.log(`OpenAI Endpoint: ${endpoint ? 'Set' : 'Missing'}`);
        context.log(`OpenAI API Key: ${apiKey ? 'Set' : 'Missing'}`);
        context.log(`OpenAI Deployment: ${deploymentName ? 'Set' : 'Missing'}`);
        
        // If environment variables are missing, use fallback behavior
        if (!endpoint || !apiKey || !deploymentName) {
            context.log('Using fallback behavior due to missing environment variables');
            return provideFallbackAnalysis(context, code, analysisType, challengeTitle);
        }
        
        // Create prompt based on analysis type
        let systemMessage = "You are an expert programming coach specialized in analyzing code for educational purposes. Provide clear, concise insights.";
        let userPrompt = "";
        
        switch (analysisType) {
            case 'explain':
                systemMessage += " Focus on explaining code in an educational way that helps students understand the concepts.";
                userPrompt = `Explain this JavaScript code that solves the "${challengeTitle}" challenge:\n\n${code}\n\nBreak down what each part does in a way that helps a student understand it.`;
                break;
                
            case 'improve':
                systemMessage += " Focus on suggesting practical improvements that follow best practices.";
                userPrompt = `Suggest 2-3 specific improvements for this JavaScript code:\n\n${code}\n\nFor each suggestion:\n1. Describe what could be improved\n2. Explain why it's beneficial\n3. Provide a code example showing the improvement`;
                break;
                
            case 'debug':
                systemMessage += " Focus on identifying and explaining potential bugs or issues.";
                userPrompt = `Review this JavaScript code for errors or issues:\n\n${code}\n\nIdentify potential bugs, logical errors, or edge cases. For each issue:\n1. Describe the problem\n2. Explain why it's problematic\n3. Suggest a solution`;
                break;
                
            default: // general analysis
                userPrompt = `Analyze this JavaScript code:\n\n${code}\n\nProvide a brief assessment of:\n- Code quality and structure\n- Potential areas for improvement\n- Strengths of the approach`;
        }
        
        // Make sure fetch is available
        const fetch = require('node-fetch');
        
        // Make the API call
        const response = await fetch(`${endpoint}/openai/deployments/${deploymentName}/chat/completions?api-version=2023-05-15`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-key': apiKey
            },
            body: JSON.stringify({
                messages: [
                    { role: "system", content: systemMessage },
                    { role: "user", content: userPrompt }
                ],
                temperature: 0.3,
                max_tokens: 800
            })
        });
        
        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(`Azure OpenAI API error: ${response.status} ${errorData}`);
        }
        
        const responseData = await response.json();
        const completion = responseData.choices[0].message.content;
        
        // Process the response based on analysis type
        let analysisResult;
        
        switch (analysisType) {
            case 'explain':
                analysisResult = {
                    explanation: completion
                };
                break;
                
            case 'improve':
                // For the hackathon, we'll keep this simpler
                analysisResult = {
                    suggestions: [
                        {
                            type: "improvement",
                            description: completion,
                            example: ""
                        }
                    ]
                };
                break;
                
            case 'debug':
                // Simple processing for the hackathon
                analysisResult = {
                    issues: [
                        {
                            description: completion,
                            suggestion: ""
                        }
                    ],
                    hasErrors: completion.toLowerCase().includes('error') || 
                              completion.toLowerCase().includes('bug') ||
                              completion.toLowerCase().includes('issue')
                };
                break;
                
            default:
                analysisResult = {
                    complexity: completion.toLowerCase().includes('complex') ? "high" : "medium",
                    readability: completion.toLowerCase().includes('readable') ? "good" : "average",
                    recommendations: completion.split('\n').filter(line => line.startsWith('-')).map(line => line.substring(1).trim()),
                    strengths: completion.split('\n').filter(line => line.startsWith('+')).map(line => line.substring(1).trim()),
                    summary: completion
                };
        }
        
        context.res = {
            status: 200,
            body: {
                success: true,
                analysis: analysisResult,
                type: analysisType
            }
        };
    } catch (err) {
        context.log.error('Analysis error:', err);
        return provideFallbackAnalysis(context, code, analysisType, challengeTitle);
    }
};

// Fallback function for when OpenAI is not available
function provideFallbackAnalysis(context, code, analysisType, challengeTitle) {
    let analysisResult;
    
    switch (analysisType) {
        case 'explain':
            let explanation = `This code appears to be solving the "${challengeTitle}" challenge. `;
            
            if (code.includes('function')) {
                explanation += "It defines a function that ";
                
                if (code.includes('for') || code.includes('while')) {
                    explanation += "uses a loop to iterate through values. ";
                } else if (code.includes('if') || code.includes('else')) {
                    explanation += "uses conditional logic to make decisions. ";
                } else {
                    explanation += "processes the input with a direct approach. ";
                }
                
                if (code.includes('return')) {
                    explanation += "The function returns a result after processing the input.";
                } else {
                    explanation += "Make sure your function returns a value to complete the solution.";
                }
            } else {
                explanation += "This code is missing a function definition, which is usually required to solve programming challenges.";
            }
            
            analysisResult = {
                explanation: explanation
            };
            break;
            
        case 'improve':
            const suggestions = [];
            
            if (!code.includes('//')) {
                suggestions.push({
                    type: "readability",
                    description: "Add comments to explain your logic and approach",
                    example: "// This function calculates the sum of all even numbers\n" + code
                });
            }
            
            if (code.includes('var ')) {
                suggestions.push({
                    type: "best practice",
                    description: "Use 'let' or 'const' instead of 'var' for variable declarations",
                    example: code.replace(/var /g, 'const ')
                });
            }
            
            if (code.match(/[a-z][0-9]|[a-z][A-Z]/) && !code.includes('function')) {
                suggestions.push({
                    type: "readability",
                    description: "Use more descriptive variable names",
                    example: "// Example with better variable names\n" + code
                });
            }
            
            analysisResult = {
                suggestions: suggestions.length > 0 ? suggestions : [{
                    type: "general",
                    description: "Your code looks good overall. Consider adding more comments to explain your approach.",
                    example: ""
                }]
            };
            break;
            
        case 'debug':
            const issues = [];
            
            if (!code.includes('return') && code.includes('function')) {
                issues.push({
                    description: "Your function doesn't have a return statement",
                    suggestion: "Add a return statement to your function to return the result"
                });
            }
            
            if (code.includes('for') && !code.includes(';')) {
                issues.push({
                    description: "Your for loop syntax might be incorrect",
                    suggestion: "Check that your for loop has the correct syntax: for (initialization; condition; increment)"
                });
            }
            
            analysisResult = {
                issues: issues.length > 0 ? issues : [{
                    description: "No obvious issues detected in your code",
                    suggestion: "Test your solution with various inputs to verify it works correctly"
                }],
                hasErrors: issues.length > 0
            };
            break;
            
        default:
            analysisResult = {
                complexity: code.length > 100 ? "medium" : "low",
                readability: code.includes('//') ? "good" : "average",
                recommendations: [
                    "Add descriptive comments to explain your logic",
                    "Use meaningful variable names",
                    "Break complex operations into smaller steps"
                ],
                strengths: [
                    "Clear function structure",
                    "Logical approach to the problem"
                ],
                summary: "This code provides a basic solution to the challenge. With some minor improvements in readability and organization, it could be more maintainable and easier to understand."
            };
    }
    
    context.res = {
        status: 200,
        body: {
            success: true,
            analysis: analysisResult,
            type: analysisType,
            note: "Using fallback analysis due to OpenAI configuration issue"
        }
    };
    
    return context.res;
}