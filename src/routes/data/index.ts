import { Router } from "express";
import { pool } from "../../client/database";
const moment_time = require("moment-timezone");
import { getCurrLecture, getTime, lecEnd } from "../../utils/functions"

const router = Router()

router.get("/get/:id", async (req, res) => {

    const id = req.params.id;

    let conn;

    try {
        conn = await pool.getConnection();

        const result = await conn.query(`SELECT * FROM student WHERE studentID=?`, [id]);

        if (!result[0]) return res.status(404).send("INVALID ID");

        const send = {
            studentID : result[0].studentID,
            name: result[0].name,
            total: result[0].total
        };

        const obj = JSON.parse(result[0].attendance);

        Object.assign(send, obj);
        res.json(result);
    } catch (error) {
        console.log(error);
        res.status(501).send("ERROR");
    } finally {
        if (conn) await conn.release();
    }
});

router.post("/mark/:id", async (req, res) => {

    const id = req.params.id;
    const { status } = req.body;
    const lecture = getCurrLecture();

    if (!status) return res.status(400).send("BAD REQUEST - NO STATUS");

    let conn;
    try {
        conn = await pool.getConnection();
        let result = await conn.query('SELECT attendance FROM student WHERE studentID=?', [id]);

        if (!result[0]) return res.status(400).send("BAD REQUEST - DATA NOT FOUND");

        try {
            result = JSON.parse(result[0].attendance);
        } catch (err) {
            console.log("ERROR IN PARSING JSON OBJECT");
            res.status(501).send("ERROR IN PARSING JSON OBJECT");   
            return;
        }

        if (result.att[result.att.length - 1].outTime && lecture === result.att[result.att.length - 1].lec) return res.status(400).send("ALREADY MARKED.");

        if (!result.att[result.att.length - 1].outTime && lecture != result.att[result.att.length - 1].lec) {
            result.pop();
        }

        if (result.att[result.att.length - 1].date === moment_time().tz("Asia/Calcutta").format('DD-MM-YY') && result.att[result.att.length - 1].lec === lecture && !result.att[result.att.length - 1].outTime) {
            
            // if (lecEnd() > getCurrLecture())
            result.att[result.att.length - 1].outTime = getTime();
            await conn.query(`UPDATE student SET attendance=? WHERE studentID=?`, [JSON.stringify(result), id]);
            res.send("ATTENDANCE MARKED SUCCESSFULLY!");
            return;
        }

        const data = {
            date: moment_time().tz("Asia/Calcutta").format('DD-MM-YY'),
            lec: lecture,
            status: status,
            inTime: getTime(),
            outTime: null
        }

        result.att.push(data);

        await conn.query(`UPDATE student SET attendance=? WHERE studentID=?`, [JSON.stringify(result), id]);
        res.send("ATTENDANCE MARKED SUCCESSFULLY!");

    } catch (error) {
        
        if (error instanceof Error) {
            console.log("=============================================");
            console.log(error.name);
            console.log(error.message);
            console.log("=============================================");
        } else {
            console.log(error)
        }
        res.status(500).send("SERVER ERROR");
    } finally {
        if (conn) await conn.release();
    }
});

router.post("/edit/:id", async(req, res) => {
    const id = req.params.id;
    const { lecture, status } = req.body;

    const password = req.headers.authorization;
    if (password === process.env.ADMIN_PASSWORD) return res.status(401).send("UNAUTHORIZED")

    let conn;
    try {
        conn = await pool.getConnection();
        let result = await conn.query('SELECT attendance,total FROM student WHERE studentID=?', [id]);

        if (!result[0]) return res.status(400).send("BAD REQUEST");

            
        result = JSON.parse(result[0].attendance);



        
    } catch (error) {
        if (error instanceof Error) {
            console.log("=============================================");
            console.log(error.name);
            console.log(error.message);
            console.log("=============================================");
        } else {
            console.log(error)
        }
        res.status(500).send("SERVER ERROR");
    } finally {
        if (conn) await conn.release();
    }
});

export default router;