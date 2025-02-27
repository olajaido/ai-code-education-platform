// module.exports = async function (context, req) {
//     context.log('Hint generation function processed a request.');

//     const { code, challengeId, difficulty, prompt } = req.body || {};
    
//     if (!code && !prompt) {
//         context.res = {
//             status: 400,
//             body: { error: "Please provide code or a specific prompt for hint generation" }
//         };
//         return;
//     }

//     try {
//         // In production, this would call Azure OpenAI with proper context
//         // For now, we'll generate contextual mock hints
        
//         let hint;
//         if (prompt) {
//             // User asked a specific question
//             if (prompt.toLowerCase().includes('loop')) {
//                 hint = "You can use a for loop to iterate through each element. Make sure your loop condition is correctly defined to avoid infinite loops.";
//             } else if (prompt.toLowerCase().includes('syntax')) {
//                 hint = "JavaScript syntax requires semicolons at the end of statements. Also check that your brackets and parentheses are properly matched.";
//             } else if (prompt.toLowerCase().includes('array')) {
//                 hint = "Arrays in JavaScript have built-in methods like .map(), .filter(), and .reduce() that can help you transform data without writing complex loops.";
//             } else {
//                 hint = "Try breaking down the problem into smaller steps. What input are you receiving and what output do you need to produce?";
//             }
//         } else {
//             // Generate hint based on code analysis
//             if (code.includes('for') || code.includes('while')) {
//                 hint = "Your loop structure looks good. Make sure you have the right termination condition to avoid infinite loops.";
//             } else if (!code.includes('return')) {
//                 hint = "Don't forget to return your result from the function!";
//             } else if (code.length < 50) {
//                 hint = "Your approach seems minimal. Are you handling all the required edge cases for this challenge?";
//             } else {
//                 hint = "Your code is looking good! Consider if there are any edge cases you need to handle better.";
//             }
//         }
        
//         // Consider difficulty level if provided
//         if (difficulty === 'beginner') {
//             hint = "Beginner tip: " + hint + " Remember that programming is about practice and persistence!";
//         } else if (difficulty === 'advanced') {
//             hint = "Advanced consideration: " + hint + " Also think about the time and space complexity of your solution.";
//         }
        
//         context.res = {
//             status: 200,
//             body: {
//                 success: true,
//                 hint,
//                 challengeId: challengeId || 'unknown'
//             }
//         };
//     } catch (err) {
//         context.log.error('Hint generation error:', err);
//         context.res = {
//             status: 500,
//             body: {
//                 error: "Failed to generate hint",
//                 message: err.message,
//                 success: false
//             }
//         };
//     }
// };

module.exports = async function (context, req) {
    context.log('Hint generation function processed a request.');

    const { code, challengeId, difficulty, prompt } = req.body || {};
    
    if (!code && !prompt) {
        context.res = {
            status: 400,
            body: { error: "Please provide code or a specific prompt for hint generation" }
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
            return provideFallbackHint(context, code, prompt, challengeId, difficulty);
        }
        
        // Create guidance based on difficulty level
        let difficultyGuidance = "";
        if (difficulty === 'beginner') {
            difficultyGuidance = "Since the user is a beginner, provide simple, clear explanations with basic concepts. Avoid advanced techniques.";
        } else if (difficulty === 'intermediate') {
            difficultyGuidance = "The user has intermediate skills, so you can reference common patterns and techniques, but still explain key concepts.";
        } else if (difficulty === 'advanced') {
            difficultyGuidance = "The user is advanced, so you can discuss optimization, best practices, and more complex approaches.";
        }
        
        // Build system message
        const systemMessage = `You are an expert coding mentor helping students learn programming through guided hints.
${difficultyGuidance}
Provide clear, concise hints that guide the student toward the solution without directly solving the problem for them.
Focus on helping them discover the solution rather than giving the answer.`;
        
        // Build user message based on whether there's a specific prompt or just code
        let userMessage;
        if (prompt) {
            userMessage = `For challenge #${challengeId}, the student asks: "${prompt}"
            
Here is their current code:
\`\`\`javascript
${code}
\`\`\`

Provide a helpful hint that addresses their specific question without solving the problem completely.`;
        } else {
            userMessage = `The student is working on challenge #${challengeId} and has written this code:
\`\`\`javascript
${code}
\`\`\`

Based on their code, provide a helpful hint about what they might be missing or should consider next. Don't solve the problem for them, but guide them in the right direction.`;
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
                    { role: "user", content: userMessage }
                ],
                temperature: 0.5,
                max_tokens: 400
            })
        });
        
        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(`Azure OpenAI API error: ${response.status} ${errorData}`);
        }
        
        const responseData = await response.json();
        const hint = responseData.choices[0].message.content;
        
        context.res = {
            status: 200,
            body: {
                success: true,
                hint,
                challengeId: challengeId || 'unknown'
            }
        };
    } catch (err) {
        context.log.error('Hint generation error:', err);
        return provideFallbackHint(context, code, prompt, challengeId, difficulty);
    }
};

// Fallback function for when OpenAI is not available
function provideFallbackHint(context, code, prompt, challengeId, difficulty) {
    // Generate a smart fallback hint based on the code content
    let hint;
    
    if (prompt && prompt.toLowerCase().includes('loop')) {
        hint = "You might want to consider using a for loop to iterate through the values. Think about what condition would make your loop stop at the right point.";
    } else if (!code.includes('return')) {
        hint = "Don't forget that functions need to return a value. Check if you've included a return statement in your code.";
    } else if (code.includes('for') || code.includes('while')) {
        hint = "Your loop structure looks good. Make sure you have the right termination condition and that you're handling each element correctly inside the loop.";
    } else {
        hint = "You're on the right track! Consider edge cases like empty inputs or unusual values. What would happen in those scenarios?";
    }
    
    // Add difficulty-specific guidance
    if (difficulty === 'beginner') {
        hint = "Beginner tip: " + hint + " Remember that programming is about practice and persistence!";
    } else if (difficulty === 'advanced') {
        hint = "Advanced consideration: " + hint + " Also think about the time and space complexity of your solution.";
    }
    
    context.res = {
        status: 200,
        body: {
            success: true,
            hint,
            challengeId: challengeId || 'unknown',
            note: "Using fallback hint generation due to OpenAI configuration issue"
        }
    };
    
    return context.res;
}