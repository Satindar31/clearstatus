import prisma from "@/prisma/prisma";


/**
 * Get the total user count from the database.
 * @returns The total number of users.
 */
export async function getTotalUserCount() {
    return await prisma.user.count();
}

export async function usersInLast24Hours() {
    return await prisma.user.count({
        where: {
            createdAt: {
                gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
            },
        }
    });
}

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


export async function DBSize() {
    return await prisma.$queryRaw`SELECT pg_size_pretty(pg_database_size(current_database())) AS database_size;`;
}

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

export async function isUserAdmin(email:string | null | undefined) {
    if (!email) return false;

    const user = await prisma.user.findUnique({
        where: { email },
    });

    return user?.admin;
}