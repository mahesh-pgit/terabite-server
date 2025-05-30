const express = require("express");
const cors = require("cors");
const fetch = require("cross-fetch");

const app = express();

// List of allowed domains
// const allowedOrigins = ["http://localhost:1234", "https://terabite.vercel.app"];

// CORS configuration
// const corsOptions = {
// 	origin: function (origin, callback) {
// 		// Allow requests with no origin (like mobile apps or curl requests)
// 		if (!origin) return callback(null, true);

// 		if (allowedOrigins.includes(origin)) {
// 			callback(null, true);
// 		} else {
// 			callback(new Error("Not allowed by CORS"));
// 		}
// 	},
// };

// Apply CORS middleware with options
// app.use(cors(corsOptions));

//  Enable CORS for all requests
app.use(cors());

// Basic welcome route
app.get("/", (req, res) => {
	res.json({ statusMessage: "Welcome to terabite server!" });
});

// API Entry Point
app.get("/api", (req, res) => {
	res.json({ statusMessage: "Extended path required. Available paths: /restaurants and /menu" });
});

// Restaurant API
app.get("/api/restaurants", async (req, res) => {
	const { lat, lng } = req.query; // Destructure latitude and longitude

	if (!lat || !lng) {
		res.json({
			statusCode: 1,
			statusMessage: "Lat or Lng is missing",
		});
	}

	console.log("Restaurant API request:", req.query); // Log the incoming request parameters

	const url = `https://www.swiggy.com/dapi/restaurants/list/v5?lat=${lat}&lng=${lng}&is-seo-homepage-enabled=true&page_type=DESKTOP_WEB_LISTING`;

	try {
		const response = await fetch(url, {
			headers: {
				"Content-Type": "application/json",
				"User-Agent":
					"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
			},
		});

		if (!response.ok) {
			throw new Error("Network response was not ok");
		}

		const data = await response.json();

		console.log("Restaurant API response:", data); // Log the response data

		res.json(data); // Send the data back to the client
	} catch (error) {
		console.error("Error fetching restaurants:", error); // Log any errors

		res.status(500).send("An error occurred while fetching restaurants");
	}
});

// Menu API
app.get("/api/menu", async (req, res) => {
	const { lat, lng, restaurantId } = req.query;

	if (!lat || !lng || !restaurantId) {
		res.json({
			statusCode: 1,
			statusMessage: "Lat or Lng or restaurantId is missing",
		});
	}

	console.log("Menu API request:", req.query); // Log the incoming request parameters

	const url = `https://www.swiggy.com/dapi/menu/pl?page-type=REGULAR_MENU&complete-menu=true&lat=${lat}&lng=${lng}&restaurantId=${restaurantId}&catalog_qa=undefined&submitAction=ENTER`;

	try {
		const response = await fetch(url, {
			headers: {
				"Content-Type": "application/json",
				"User-Agent":
					"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
			},
		});

		if (!response.ok) {
			throw new Error("Network response was not ok");
		}

		const data = await response.json();

		console.log("Menu API response:", data); // Log the response data

		res.json(data); // Send the data back to the client
	} catch (error) {
		console.error("Error fetching menu:", error); // Log any errors

		res.status(500).send("An error occurred while fetching the menu");
	}
});

// Start the server
app.listen(3000, "0.0.0.0", () => {
	console.log("Server is listening on port 3000");
});
