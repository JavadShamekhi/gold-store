import {prisma} from "@/src/lib/prisma";

export async function GET(req: Request) {
	try {
		const {searchParams} = new URL(req.url);
		const userId = searchParams.get("userId");

		if (!userId) {
			return Response.json({error: "Missing userId"}, {status: 400});
		}

		const data = await prisma.goldTransaction.findMany({
			where: {userId},
			orderBy: {createdAt: "desc"},
		});

		return Response.json(data);
	} catch (err) {
		return Response.json({error: "Server error"}, {status: 500});
	}
}