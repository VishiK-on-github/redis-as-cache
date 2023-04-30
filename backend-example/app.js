const express = require("express");
const axios = require("axios");
const cors = require("cors");
const redis = require("redis");

const redisClient = redis.createClient();
redisClient.connect();
const EXPIRATION = 3600;

const app = express();
app.use(cors());

app.get("/photos", async (req, res) => {
	const albumId = req.query.albumId;
	val = await redisClient.get("photos");
	if (val == null) {
		console.info("Cache Miss");
		const { data } = await axios.get(
			"https://jsonplaceholder.typicode.com/photos",
			{ params: { albumId } }
		);
		redisClient.SETEX("photos", EXPIRATION, JSON.stringify(data));
		return res.json(data);
	} else {
		console.info("Cache Hit");
		return res.json(JSON.parse(val));
	}
});

app.listen(3000);
