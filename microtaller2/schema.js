const schema = {
    type: "object",
    properties: {
      id: { type: "string" }, 
      username: { type: "string" },
      email: { type: "string", format: "email" },
      password: { type: "string" },
      createdAt: { type: "string", format: "date-time" },
      updatedAt: { type: "string", format: "date-time" },
      tokenExpiry: { type: "string", format: "date-time" } 
    },
    additionalProperties: false
  };
  
  module.exports = schema;
  