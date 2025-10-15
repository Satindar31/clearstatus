import prisma from "@/prisma/prisma";


/**
 * Get the total user count from the database.
 * @returns The total number of users.
 */
export async function getTotalUserCount() {
    return await prisma.user.count();
}

/**
 * Counts the number of users created in the last 24 hours.
 *
 * @returns A promise that resolves to the number of users created within the past 24 hours.
 */
export async function usersInLast24Hours() {
    return await prisma.user.count({
        where: {
            createdAt: {
                gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
            },
        }
    });
}

/**
 * Calculates the percentage change in the number of users who signed up in the last 24 hours
 * compared to the previous 24-hour period (i.e., 24-48 hours ago).
 *
 * - If no users signed up in the previous period, returns the count of users in the last 24 hours.
 * - Otherwise, returns the percentage increase or decrease in user signups.
 *
 * @returns {Promise<number>} The percentage change in user signups, or the count if the previous period had zero signups.
 */
export async function userChangeIn24Hours() {
    // Get the users who signed up 2 days ago
    const twoDaysAgo = await prisma.user.count({
        where: {
            createdAt: {
                gte: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
                lt: new Date(Date.now() - 24 * 60 * 60 * 1000),
            },
        }
    });
    const yesterday = await prisma.user.count({
        where: {
            createdAt: {
                gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
                lt: new Date(),
            },
        }
    });

    // calculate % user increase or decrease
    if (twoDaysAgo === 0) return yesterday;
    return ((yesterday - twoDaysAgo) / twoDaysAgo) * 100;
}


/**
 * Retrieves the current PostgreSQL database size in a human-readable format.
 *
 * @returns A promise that resolves to the result of the SQL query, which includes the database size as a string (e.g., '42 MB').
 *
 * @example
 * const result = await DBSize();
 * console.log(result); // [{ database_size: '42 MB' }]
 */
export async function DBSize() {
    return await prisma.$queryRaw`SELECT pg_size_pretty(pg_database_size(current_database())) AS database_size;`;
}

/**
 * Fetches the number of stars for the GitHub repository `satindar31/clearstatus`.
 *
 * Utilizes the GitHub REST API to retrieve the current stargazer count.
 * The response is cached and revalidated every hour to reduce API calls.
 *
 * @returns {Promise<number>} A promise that resolves to the number of stargazers (stars) on the repository.
 *
 * @throws {Error} If the fetch request fails or the response is not valid JSON.
 */
export async function githubStars() {
    // get the amount of stars on satindar31/clearstatus
    const response = await fetch("https://api.github.com/repos/satindar31/clearstatus", {
        cache: "force-cache",
        next: {
            revalidate: 60*60, // revalidate every hour
        }
    });
    const data = await response.json();

    return await data.stargazers_count;
}

/**
 * Checks if a user with the specified email has admin privileges.
 *
 * @param email - The email address of the user to check. Can be a string, null, or undefined.
 * @returns A promise that resolves to `true` if the user is an admin, or `false` otherwise.
 */
export async function isUserAdmin(email:string | null | undefined) {
    if (!email) return false;

    const user = await prisma.user.findUnique({
        where: { email },
    });

    return user?.admin;
}