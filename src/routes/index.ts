import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

const intervalDurations: Record<string, number> = {
  minute: 60 * 60 * 1000, // 1 hour in milliseconds
  hour: 24 * 60 * 60 * 1000, // 1 day in milliseconds
  day: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
};

router.get("/", function (req: Request, res: Response) {
  res.json({ message: "Hello!" });
});

router.post("/metrics", async (req: Request, res: Response) => {
  console.log("POST /metrics", req.body);
  try {
    const { sales_rep, amount, timestamp } = req.body;

    if (!timestamp || isNaN(Date.parse(timestamp))) {
      res.status(400).json({ error: "Invalid or missing timestamp" });
      return;
    }

    if (!sales_rep || typeof amount !== "number") {
      res.status(400).json({ error: "Invalid input data" });
      return;
    }

    const metric = await prisma.metrics.create({
      data: { timestamp, sales_rep, amount },
    });

    res.json(metric);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Failed to insert metric" });
  }
});

router.get("/individual-sales", async (req: Request, res: Response) => {
  console.log("GET /individual-sales", req.query);
  try {
    const interval = req.query.interval as
      | "minute"
      | "hour"
      | "day"
      | undefined;
    if (!interval) {
      res.status(400).json({ error: "Interval query param is required" });
      return;
    }

    const duration = intervalDurations[interval];
    if (!duration) {
      res.status(400).json({ error: "Invalid interval value" });
      return;
    }

    const startTime = new Date(Date.now() - duration);

    const individualSales = await prisma.metrics.findMany({
      where: {
        timestamp: {
          gte: startTime,
        },
      },
    });

    res.json(individualSales);
  } catch (error) {
    console.error("Error fetching individual sales:", error);
    res.status(500).json({ error: "Failed to retrieve individual sales" });
  }
});

router.get("/metrics", async (req: Request, res: Response) => {
  console.log("GET /metrics", req.query);
  try {
    const interval = req.query.interval as
      | "minute"
      | "hour"
      | "day"
      | undefined;

    if (!interval) {
      res.status(400).json({ error: "Interval query param is required" });
      return;
    }

    const duration = intervalDurations[interval];
    if (!duration) {
      res.status(400).json({ error: "Invalid interval value" });
      return;
    }

    const startTime = new Date(Date.now() - duration);

    let metrics = await prisma.metrics.findMany({
      where: {
        timestamp: {
          gte: startTime,
        },
      },
    });

    if (interval === "minute") {
      const minuteBuckets: Record<string, { total: number; count: number }> =
        {};

      metrics.forEach((metric) => {
        /* const minuteBucket = new Date(metric.timestamp)
          .toISOString()
          .slice(0, 16); // Format: YYYY-MM-DDTHH:MM */
        const date = new Date(metric.timestamp);
        date.setSeconds(0, 0); // Reset seconds and milliseconds
        const minuteBucket = date.toISOString(); // Full ISO string for the start of the hour

        if (!minuteBuckets[minuteBucket]) {
          minuteBuckets[minuteBucket] = { total: 0, count: 0 };
        }
        minuteBuckets[minuteBucket].total += metric.amount;
        minuteBuckets[minuteBucket].count += 1;
      });

      const minuteAverages = Object.entries(minuteBuckets).map(
        ([minute, { total, count }]) => ({
          time_bucket: minute,
          avg_sales: total / count,
        })
      );
      console.log(minuteAverages);
      res.json(minuteAverages);
      return;
    } else if (interval === "hour") {
      const hourlyBuckets: Record<string, { total: number; count: number }> =
        {};

      metrics.forEach((metric) => {
        const date = new Date(metric.timestamp);
        date.setMinutes(0, 0, 0); // Reset minutes, seconds, and milliseconds
        const hourBucket = date.toISOString(); // Full ISO string for the start of the hour

        /* const hourBucket = new Date(metric.timestamp)
          .toISOString()
          .slice(0, 13); // Format: YYYY-MM-DDTHH */
        if (!hourlyBuckets[hourBucket]) {
          hourlyBuckets[hourBucket] = { total: 0, count: 0 };
        }
        hourlyBuckets[hourBucket].total += metric.amount;
        hourlyBuckets[hourBucket].count += 1;
      });

      const hourlyAverages = Object.entries(hourlyBuckets).map(
        ([hour, { total, count }]) => ({
          time_bucket: hour,
          avg_sales: total / count,
        })
      );
      console.log(hourlyAverages);
      res.json(hourlyAverages);
      return;
    } else if (interval === "day") {
      const dailyBuckets: Record<string, { total: number; count: number }> = {};

      metrics.forEach((metric) => {
        const dayBucket = new Date(metric.timestamp).toISOString().slice(0, 10); // Format: YYYY-MM-DD
        if (!dailyBuckets[dayBucket]) {
          dailyBuckets[dayBucket] = { total: 0, count: 0 };
        }
        dailyBuckets[dayBucket].total += metric.amount;
        dailyBuckets[dayBucket].count += 1;
      });

      const dailyAverages = Object.entries(dailyBuckets).map(
        ([day, { total, count }]) => ({
          time_bucket: day,
          avg_sales: total / count,
        })
      );
      console.log(dailyAverages);
      res.json(dailyAverages);
      return;
    }
  } catch (error) {
    console.error("Error fetching metrics:", error);
    res.status(500).json({ error: "Failed to retrieve metrics" });
  }
});

export default router;
