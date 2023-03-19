import fetch from 'isomorphic-fetch';

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {
	const { slug } = req.query;
	const url = slug.join('/');

	const response = await fetch(url);
	const data = await response.text();

	res.status(response.status).send(data);
};
