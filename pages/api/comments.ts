import { NextApiRequest, NextApiResponse } from "next";

const handler = (req: NextApiRequest, res: NextApiResponse) => {
   if (req.method === "POST") {
      res.status(201).json({ message: "Comment created successfully" });
   } else {
      res.status(400).json({ message: "Method not allowed" });
   }
}

export default handler;