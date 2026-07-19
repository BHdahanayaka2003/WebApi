const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const dataPath = path.join(__dirname, "seed.json");
const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));

function lastPing(vehicleId) {
    const pings = data.pings
        .filter(p => p.vehicle_id === vehicleId)
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return pings[0] || null;
}

app.get("/", (req, res) => {
    res.json(data);
});

app.get("/provinces", (req, res) => {
    res.json(data.provinces);
});

app.get("/provinces/:id", (req, res) => {
    res.json(
        data.provinces.find(
            p => p.province_id === req.params.id
        )
    );
});

app.get("/districts", (req, res) => {
    res.json(data.districts);
});

app.get("/districts/:id", (req, res) => {
    res.json(
        data.districts.find(
            d => d.district_id === req.params.id
        )
    );
});

app.get("/stations", (req, res) => {
    res.json(data.stations);
});

app.get("/stations/:id", (req, res) => {
    res.json(
        data.stations.find(
            s => s.station_id === req.params.id
        )
    );
});

app.get("/vehicles", (req, res) => {
    res.json(data.vehicles);
});

app.get("/vehicles/:id", (req, res) => {
    const v = data.vehicles.find(
        v => v.vehicle_id === req.params.id
    );

    res.json({
        ...v,
        last_ping: lastPing(req.params.id)
    });
});

app.get("/vehicles/:id/pings", (req, res) => {
    res.json(
        data.pings.filter(
            p => p.vehicle_id === req.params.id
        )
    );
});

app.get("/vehicles/:id/last-position", (req, res) => {
    res.json(lastPing(req.params.id));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`TukTuk API running at http://localhost:${port}`);
    console.log("GET / returns the full seed.json data");
});
