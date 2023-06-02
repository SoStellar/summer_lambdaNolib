import pg from "pg";

export const handler = async (event) => {
  try {
    const requestBody = event;
    const value1 = requestBody.value1; // Replace 'value1' with the actual key in your JSON

    // Create the PostgreSQL connection configuration
    const rdsConfig = {
      host: process.env.RDS_HOST,
      user: process.env.RDS_USER,
      password: process.env.RDS_PASSWORD,
      database: process.env.RDS_DATABASE,
      port: process.env.RDS_PORT || 5432, // default PostgreSQL port
    };

    const client = new pg.Client(rdsConfig);
    await client.connect();

    // Insert values into the table
    const insertQuery = `INSERT INTO lambdatesttable (name, age) VALUES ($1)`; // Replace 'your_table', 'column1', 'column2' with your actual table and column names
    const insertValues = [value1]; // Provide the values extracted from the JSON body

    await client.query(insertQuery, insertValues);

    // Close the database connection
    await client.end();

    // Return a success response
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Data inserted successfully" }),
    };
  } catch (error) {
    console.error("Error inserting data into the table:", error);

    // Return an error response
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error inserting data into the table" }),
    };
  }
};
