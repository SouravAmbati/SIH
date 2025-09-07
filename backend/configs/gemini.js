import { GoogleGenAI,Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });


//edit
async function getQuiz() {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `You are a career counselor AI. Generate a 10-question multiple-choice quiz to help identify which academic stream is best for a high school student.  
The streams are: Science, Commerce, Arts/Humanities, Vocational/Skill-based.  

Instructions:
1. Each question should have 4 options (A–D).  
2. The questions should assess interests, skills, and personality traits.  
3. Avoid direct questions like "Do you like Science?" – instead, use scenarios or preference-based questions.  
4. At the end, provide a scoring guide that maps choices to streams.  

Output format:
Q1. [Question]  
A. [Option]  
B. [Option]  
C. [Option]  
D. [Option]  
`,
config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          questions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                options: {
                  type: Type.OBJECT,
                  properties: {
                    A: { type: Type.STRING },
                    B: { type: Type.STRING },
                    C: { type: Type.STRING },
                    D: { type: Type.STRING },
                  },
                },
              },
              propertyOrdering: ["question", "options"],
            },
          },
        },
      },
    },
  });
   const jsonResult = JSON.parse(response.text);

  return jsonResult;
}



async function analyzeQuiz(userAnswers) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `
User selected answers: ${JSON.stringify(userAnswers)}
    
Analyze the user's answers and determine the most suitable academic stream(s) based on the rules mentioned. Return only valid JSON.
`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          streamSummary: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                stream: { type: Type.STRING },
                count: { type: Type.NUMBER },
              },
            },
          },
          bestStream: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          recommendation: { type: Type.STRING },
        },
      },
    },
  });

  return JSON.parse(response.text);
}

async function DreamAnalyzer(userAnswers) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `
The student will write freely about what they love to do, their dreams, and their interests.  
Act as a supportive career counselor.  
Based on ${userAnswers}, suggest  best academic streams   

Respond in JSON:  
{
  "stream": "chosen stream",
}
.
`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          streamSummary: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                stream: { type: Type.STRING },
              },
            },
          },
        },
      },
    },
  });

  return JSON.parse(response.text);
}





async function CareerOptions(stream) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `
You are an AI education counselor.  
The student has been matched with this academic stream: ${stream}.  

Your task:  
1. Suggest 5–7 popular academic courses in this stream (e.g., B.Tech, B.Com, BA, Diploma).  
2. For each course, list 3–5 common career paths that students usually pursue after completing the course.  

Respond only in JSON with this format:  
{
  "stream": "{STREAM}",
  "courses": [
    {
      "name": "Course Name",
      "career_paths": [
        "Career Path 1",
        "Career Path 2",
        "Career Path 3"
      ]
    }
  ]
}

`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          stream: { type: Type.STRING },
          courses: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          career_paths: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
        },
         required: ["stream", "courses", "career_paths"],
      },
    },
  });

return JSON.parse(response.text);
}



async function CareerBrief(courseName) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `
You are an AI education counselor.  
Given the academic course: ${courseName}, generate the following:

1. Course Overview: A short description (4–6 sentences) explaining the course, what it covers, and its purpose.  
2. Career Paths: 4–6 common career options after completing the course.  
3. Related Skills: 4–6 key skills students gain or need to succeed in this course.  

Respond only in JSON format like this:
{
  "course": "${courseName}",
  "overview": "text here",
  "career_paths": ["Career 1", "Career 2", "Career 3"],
  "related_skills": ["Skill 1", "Skill 2", "Skill 3"]
}
`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          course: { type: Type.STRING },
          overview: { type: Type.STRING },
          career_paths: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          related_skills: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["course", "overview", "career_paths", "related_skills"]
      }
    }
  });

  return JSON.parse(response.text);
}


async function getColleges(location, degreeType) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `
You are an AI education counselor.  
The student is looking for 10 colleges in or near the location: ${location}.  
The degree type they are interested in is: ${degreeType}.  

Based on this information, generate a list of suitable colleges in or near that location.  
For each college, include the following details:  
1. College Name  
2. Courses Offered (relevant to ${degreeType})  
3. Facilities available (hostel, library, labs, sports, etc.)  
4. Cutoff scores/percentages for admission (approximate if exact data is not available)  

Respond only in JSON format.
`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          location: { type: Type.STRING },
          degree_type: { type: Type.STRING },
          colleges: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                courses_offered: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                facilities: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                cutoff: { type: Type.STRING }
              },
              required: ["name", "courses_offered", "facilities", "cutoff"]
            }
          }
        },
        required: ["location", "degree_type", "colleges"]
      }
    }
  });

  return JSON.parse(response.text);
}

async function getCollegeDetails(collegeName) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `
You are an AI education counselor.  
The student provides the college name: ${collegeName}.  

Provide the following details for this college in JSON format:  
1. College Name  
2. Courses Offered (relevant to this college)  
   - For each course, include:
     - Course Name
     - Duration (years)
     - Motive (one-line description)
     - Eligibility
     - Cutoff (approximate if exact data not available)
3. Facilities available (hostel, library, labs, sports, etc.)  
4. Official Email  
5. Official Website  
6. Phone Number  
7. Full Address  

Respond strictly in JSON format like this example:
{
  "college_name": "${collegeName}",
  "courses_offered": [
    {
      "course_name": "B.Tech in Computer Science",
      "duration": "4 years",
      "motive": "Learn the fundamentals of computer science and software development.",
      "eligibility": "10+2 with PCM and minimum 60% marks",
      "cutoff": "JEE Main rank 5000"
    }
  ],
  "facilities": ["Library", "Hostel", "Labs", "Sports Complex"],
  "email": "contact@examplecollege.edu",
  "website": "https://www.examplecollege.edu",
  "phone_number": "+91-1234567890",
  "address": "123 College Street, City, State, PIN"
}
`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          college_name: { type: Type.STRING },
          courses_offered: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                course_name: { type: Type.STRING },
                duration: { type: Type.STRING },
                motive: { type: Type.STRING },
                eligibility: { type: Type.STRING },
                cutoff: { type: Type.STRING }
              },
              required: ["course_name", "duration", "motive", "eligibility", "cutoff"]
            }
          },
          facilities: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          email: { type: Type.STRING },
          website: { type: Type.STRING },
          phone_number: { type: Type.STRING },
          address: { type: Type.STRING }
        },
        required: ["college_name", "courses_offered", "facilities", "email", "website", "phone_number", "address"]
      }
    }
  });

  return JSON.parse(response.text);
}





export {getQuiz,analyzeQuiz,DreamAnalyzer,CareerOptions,CareerBrief,getColleges,getCollegeDetails}



`You are an AI career counselor.  
The student has been matched with the academic stream: {STREAM}.  
Suggest 8–10 possible career paths for this stream.  
Only return the career path names in a JSON array.  

Respond in JSON:  
{
  "stream": "{STREAM}",
  "career_paths": [
    "Career 1",
    "Career 2",
    "Career 3",
    ...
  ]
}

`