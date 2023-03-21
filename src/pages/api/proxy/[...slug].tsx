import { NextApiRequest, NextApiResponse } from "next";

require("isomorphic-fetch");

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { slug } = req.query;
	// @ts-ignore
  const url = slug.join("/");

  const response = await fetch(url);
  const data = await response.text();

  res.status(response.status).send(data);
};
