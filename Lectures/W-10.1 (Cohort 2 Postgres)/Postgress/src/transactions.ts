// Good question to have at this point is what queries are run when the user signs up and sends both their information and their address in a single request.
// Do we send two SQL queries into the database? What if one of the queries (address query for example) fails?
// This would require transactions  in SQL to ensure either both the user information and address goes in, or neither does

import { Client } from "pg";

async function insertUserAndAddress(
  username: string,
  email: string,
  password: string,
  city: string,
  country: string,
  street: string,
  pincode: string
) {
  const client = new Client({
    // connectionString: 'postgresql://pkmanas22:eijBGc85MNYR@ep-divine-rice-a5z5qg2g.us-east-2.aws.neon.tech/test?sslmode=require'
    connectionString:
      "postgresql://cohort_owner:6kgAs2KIcHRS@ep-summer-tree-a5w33tk2.us-east-2.aws.neon.tech/cohort?sslmode=require",
  });

  try {
    await client.connect();

    // Start transaction
    await client.query("BEGIN");

    // Insert user
    const insertUserText = `
            INSERT INTO users (username, email, password)
            VALUES ($1, $2, $3)
            RETURNING id;
        `;
    const userRes = await client.query(insertUserText, [
      username,
      email,
      password,
    ]);
    const userId = userRes.rows[0].id;

    // Insert address using the returned user ID
    const insertAddressText = `
            INSERT INTO addresses (user_id, city, country, street, pincode)
            VALUES ($1, $2, $3, $4, $5);
        `;
    await client.query(insertAddressText, [
      userId,
      city,
      country,
      street,
      pincode,
    ]);

    // Commit transaction
    await client.query("COMMIT");

    console.log("User and address inserted successfully");
  } catch (err) {
    await client.query("ROLLBACK"); // Roll back the transaction on error
    console.error("Error during transaction, rolled back.", err);
    throw err;
  } finally {
    await client.end(); // Close the client connection
  }
}

// Example usage
insertUserAndAddress(
  "johndoe",
  "john.doe@example.com",
  "securepassword123",
  "New York",
  "USA",
  "123 Broadway St",
  "10001"
);
