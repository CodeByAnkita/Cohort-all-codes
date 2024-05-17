// Join is used to combine two or more table together

import { Client } from "pg";

// Async function to fetch user data and their address together
async function getUserDetailsWithAddress(userId: string) {
  const client = new Client({
    connectionString:
      "postgresql://cohort_owner:6kgAs2KIcHRS@ep-summer-tree-a5w33tk2.us-east-2.aws.neon.tech/cohort?sslmode=require",
    // connectionString: 'postgresql://pkmanas22:eijBGc85MNYR@ep-divine-rice-a5z5qg2g.us-east-2.aws.neon.tech/test?sslmode=require'
  });

  try {
    await client.connect();
    const query = `
            SELECT u.id, u.username, u.email, a.city, a.country, a.street, a.pincode
            FROM users u
            JOIN addresses a ON u.id = a.user_id
            WHERE u.id = $1
        `;
    const result = await client.query(query, [userId]);

    if (result.rows.length > 0) {
      console.log("User and address found:", result.rows[0]);
      return result.rows[0];
    } else {
      console.log("No user or address found with the given ID.");
      return null;
    }
  } catch (err) {
    console.error("Error during fetching user and address:", err);
    throw err;
  } finally {
    await client.end();
  }
}
getUserDetailsWithAddress("1");
