import axios from "axios";
import dotenv from 'dotenv';
import ffmpeg from 'fluent-ffmpeg';
import nodeSpeech from 'node-speech';
const { SpeechClient } = nodeSpeech;


dotenv.config();

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

export const generateQuestions = async ({ jobTitle, jobDescription, experience }) => {
  try {
    const prompt = `Generate 5 online interview  questions to ask orally for a ${jobTitle} role.which doesnt require
                   code execution.
                   The job description is: ${jobDescription}. 
                   The required experience is ${experience} years. 
                   Return only a JSON array like this: 
                   ["Question 1", "Question 2", "Question 3", "Question 4", "Question 5"].
                   `;

    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Groq API Error:", errorData);
      throw new Error(`Groq API error: ${errorData.error?.message || "Unknown error"}`);
    }

    const data = await response.json();
    console.log("Groq API Raw Response:", JSON.stringify(data, null, 2)); // Debugging

    if (!data.choices || !data.choices.length) {
      throw new Error("Groq API response is missing 'choices'");
    }

    const messageContent = data.choices[0].message.content.trim(); // Access `message.content`

    // Extract JSON array from the response
    const jsonMatch = messageContent.match(/\[.*\]/s);
    if (!jsonMatch) {
      throw new Error("Groq API response does not contain a valid JSON array.");
    }

    return JSON.parse(jsonMatch[0]); // Extracted JSON array
  } catch (error) {
    console.error("Error calling Groq API:", error.message);
    throw new Error("Failed to generate questions");
  }
};


export const evaluateAnswer = async (questionAnswerPairs) => {
  try {
    
    const prompt = `Evaluate the following interview answers while ignoring minor spelling mistakes:
      ${questionAnswerPairs
        .map((qa, index) => `\n${index + 1}. Q: "${qa.question}" A: "${qa.answer}"`)
        .join("\n")}

      Do not penalize for spelling mistakes or minor grammatical errors unless they significantly impact meaning.
      
      Provide a valid JSON array where each entry strictly follows this format:
      [
        {
          "feedback": "Detailed feedback here",
          "score": number
        }
      ]
    `;

    

    const response = await axios.post(
      GROQ_API_URL,
      {
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        response_format: { type: "json_object" },  
      },
      {
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Extracting evaluation results
    const feedbackResults = response.data?.choices?.[0]?.message?.content;
    
    if (!feedbackResults) {
      throw new Error("Invalid response structure from API");
    }

    
    return JSON.parse(feedbackResults); // Ensure it's correctly parsed JSON

  } catch (error) {
    console.error("Error evaluating answers:", error.response?.data || error.message);
    throw new Error("Failed to evaluate answers");
  }
};

