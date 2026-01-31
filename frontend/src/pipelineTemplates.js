// frontend/src/pipelineTemplates.js

export const TEMPLATES = [
    {
        id: 'chatbot-integration',
        title: 'Customer Support Chatbot',
        description: 'A responsive chatbot flow that takes user queries, processes them via LLM, and provides answers. Ideal for website integration.',
        requirements: ['OpenAI API Key'],
        tags: ['Support', 'Chat'],
        nodes: [
            { id: '1', type: 'customInput', position: { x: 100, y: 200 }, data: { inputName: 'User Query', inputType: 'Text' } },
            { id: '2', type: 'llm', position: { x: 400, y: 200 }, data: { model: 'gpt-4', temperature: 0.7, systemMessage: 'You are a helpful customer support agent.' } },
            { id: '3', type: 'customOutput', position: { x: 700, y: 200 }, data: { outputName: 'Response', outputType: 'Text' } }
        ],
        edges: [
            { id: 'e1-2', source: '1', target: '2', sourceHandle: 'value', targetHandle: 'prompt', type: 'customEdge' },
            { id: 'e2-3', source: '2', target: '3', sourceHandle: 'response', targetHandle: 'value', type: 'customEdge' }
        ]
    },
    {
        id: 'auto-reply-mail',
        title: 'Automated Email Reply',
        description: 'For merchants: automatically drafts replies to customer emails based on your business context and sends them for review.',
        requirements: ['Email API', 'Business Context'],
        tags: ['Business', 'Automation'],
        nodes: [
            { id: '1', type: 'customInput', position: { x: 50, y: 200 }, data: { inputName: 'Incoming Email', inputType: 'Text' } },
            { id: '2', type: 'text', position: { x: 300, y: 100 }, data: { text: 'Business Context: We sell organic coffee. \n Email: {{email_content}}' } },
            { id: '3', type: 'llm', position: { x: 600, y: 200 }, data: { model: 'gpt-3.5', systemMessage: 'Draft a polite reply to this customer.' } },
            { id: '4', type: 'slack', position: { x: 900, y: 200 }, data: { channel: '#email-review' } }
        ],
        edges: [
            { id: 'e1-2', source: '1', target: '2', sourceHandle: 'value', targetHandle: 'email_content', type: 'customEdge' },
            { id: 'e2-3', source: '2', target: '3', sourceHandle: 'output', targetHandle: 'prompt', type: 'customEdge' },
            { id: 'e3-4', source: '3', target: '4', sourceHandle: 'response', targetHandle: 'msg', type: 'customEdge' }
        ]
    },
    {
        id: 'email-classifier',
        title: 'Email Classification AI',
        description: 'Analyzes incoming emails to categorize them (Urgent, Sales, Spam) and routes them to the correct department via Slack.',
        requirements: ['LLM', 'Slack Workspace'],
        tags: ['Classification', 'Ops'],
        nodes: [
            { id: '1', type: 'customInput', position: { x: 50, y: 250 }, data: { inputName: 'Email Body', inputType: 'Text' } },
            { id: '2', type: 'llm', position: { x: 350, y: 250 }, data: { systemMessage: 'Classify this email as URGENT, SALES, or SPAM. Only output the category.', model: 'gpt-4' } },
            { id: '3', type: 'note', position: { x: 650, y: 100 }, data: { text: 'Routing Logic: \n If Urgent -> #support \n If Sales -> #sales' } },
            { id: '4', type: 'slack', position: { x: 650, y: 350 }, data: { channel: '#triage-bot' } }
        ],
        edges: [
            { id: 'e1-2', source: '1', target: '2', sourceHandle: 'value', targetHandle: 'prompt', type: 'customEdge' },
            { id: 'e2-4', source: '2', target: '4', sourceHandle: 'response', targetHandle: 'msg', type: 'customEdge' }
        ]
    },
    {
        id: 'resume-review',
        title: 'Resume Review AI',
        description: 'Upload a candidate\'s PDF resume. The AI extracts text, evaluates skills against the job description, and outputs a score.',
        requirements: ['PDF Parser', 'GPT-4'],
        tags: ['HR', 'Recruiting'],
        nodes: [
            { id: '1', type: 'customInput', position: { x: 50, y: 200 }, data: { inputName: 'Resume (PDF)', inputType: 'File' } },
            { id: '2', type: 'text', position: { x: 300, y: 100 }, data: { text: 'Job Description: Senior React Dev. \n Candidate: {{resume}}' } },
            { id: '3', type: 'llm', position: { x: 600, y: 200 }, data: { model: 'gpt-4', temperature: 0.2, systemMessage: 'Analyze the candidate fit. Give a score 1-10.' } },
            { id: '4', type: 'customOutput', position: { x: 900, y: 200 }, data: { outputName: 'Evaluation Report', outputType: 'Text' } }
        ],
        edges: [
            { id: 'e1-2', source: '1', target: '2', sourceHandle: 'value', targetHandle: 'resume', type: 'customEdge' },
            { id: 'e2-3', source: '2', target: '3', sourceHandle: 'output', targetHandle: 'prompt', type: 'customEdge' },
            { id: 'e3-4', source: '3', target: '4', sourceHandle: 'response', targetHandle: 'value', type: 'customEdge' }
        ]
    },
    {
        id: 'blog-writing',
        title: 'Blog Writing Assistant',
        description: 'End-to-end content creation. Takes a topic, generates an outline, writes the full article, and prepares it for publishing.',
        requirements: ['Content Topic'],
        tags: ['Marketing', 'Content'],
        nodes: [
            { id: '1', type: 'customInput', position: { x: 50, y: 300 }, data: { inputName: 'Blog Topic', inputType: 'Text' } },
            { id: '2', type: 'llm', position: { x: 300, y: 150 }, data: { systemMessage: 'Create a detailed 5-point outline for this topic.' } },
            { id: '3', type: 'llm', position: { x: 600, y: 300 }, data: { systemMessage: 'Write a 1000-word SEO optimized article based on the outline.', model: 'claude-3' } },
            { id: '4', type: 'customOutput', position: { x: 900, y: 300 }, data: { outputName: 'Final Draft', outputType: 'Text' } }
        ],
        edges: [
            { id: 'e1-2', source: '1', target: '2', sourceHandle: 'value', targetHandle: 'prompt', type: 'customEdge' },
            { id: 'e2-3', source: '2', target: '3', sourceHandle: 'response', targetHandle: 'prompt', type: 'customEdge' },
            { id: 'e3-4', source: '3', target: '4', sourceHandle: 'response', targetHandle: 'value', type: 'customEdge' }
        ]
    },
    {
        id: 'product-image-ai',
        title: 'Product Image Enhancer',
        description: 'Automates product photography. Removes the background from a raw photo and uses AI to generate a lifestyle background.',
        requirements: ['Remove.bg API', 'Stable Diffusion'],
        tags: ['E-commerce', 'Design'],
        nodes: [
            { id: '1', type: 'customInput', position: { x: 50, y: 200 }, data: { inputName: 'Raw Photo', inputType: 'File' } },
            { id: '2', type: 'api', position: { x: 300, y: 100 }, data: { url: 'https://api.remove.bg/v1/remove', method: 'POST' } },
            { id: '3', type: 'llm', position: { x: 300, y: 350 }, data: { systemMessage: 'Describe a luxury kitchen setting for a background.' } },
            { id: '4', type: 'customOutput', position: { x: 600, y: 100 }, data: { outputName: 'Transparent Image', outputType: 'Image' } },
            { id: '5', type: 'customOutput', position: { x: 600, y: 350 }, data: { outputName: 'Lifestyle Composite', outputType: 'Image' } }
        ],
        edges: [
            { id: 'e1-2', source: '1', target: '2', sourceHandle: 'value', targetHandle: 'req', type: 'customEdge' },
            { id: 'e1-3', source: '1', target: '3', sourceHandle: 'value', targetHandle: 'prompt', type: 'customEdge' },
            { id: 'e2-4', source: '2', target: '4', sourceHandle: 'res', targetHandle: 'value', type: 'customEdge' }
        ]
    },
    {
        id: 'job-apply-automation',
        title: 'Job Application Automation',
        description: 'Scrapes a LinkedIn job post, matches it with your resume, and generates a tailored cover letter automatically.',
        requirements: ['LinkedIn URL', 'Resume'],
        tags: ['Personal', 'Productivity'],
        nodes: [
            { id: '1', type: 'customInput', position: { x: 50, y: 100 }, data: { inputName: 'Job URL', inputType: 'Text' } },
            { id: '2', type: 'api', position: { x: 300, y: 100 }, data: { url: 'https://api.scrapingdog.com/linkedin', method: 'GET' } },
            { id: '3', type: 'database', position: { x: 50, y: 300 }, data: { fileName: 'my_resume.pdf' } },
            { id: '4', type: 'text', position: { x: 550, y: 200 }, data: { text: 'Job: {{job_data}} \n My Resume: {{resume_data}}' } },
            { id: '5', type: 'llm', position: { x: 800, y: 200 }, data: { systemMessage: 'Write a persuasive cover letter connecting the resume to the job.', model: 'gpt-4' } },
            { id: '6', type: 'customOutput', position: { x: 1050, y: 200 }, data: { outputName: 'Cover Letter', outputType: 'Text' } }
        ],
        edges: [
            { id: 'e1-2', source: '1', target: '2', sourceHandle: 'value', targetHandle: 'req', type: 'customEdge' },
            { id: 'e2-4', source: '2', target: '4', sourceHandle: 'res', targetHandle: 'job_data', type: 'customEdge' },
            { id: 'e3-4', source: '3', target: '4', sourceHandle: 'data', targetHandle: 'resume_data', type: 'customEdge' },
            { id: 'e4-5', source: '4', target: '5', sourceHandle: 'output', targetHandle: 'prompt', type: 'customEdge' },
            { id: 'e5-6', source: '5', target: '6', sourceHandle: 'response', targetHandle: 'value', type: 'customEdge' }
        ]
    }
];