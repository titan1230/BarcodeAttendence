import { Router } from "express"
import { pool } from "../../client/database";
import { checkPassword, hashPassword } from "../../utils/functions";

const router = Router()

// ==> /account/*
router.post("/login", async (req, res) => {
    const { id, pass } = req.body;

    if (!pass) return res.status(400).send("BAD REQUEST.");

    let conn;
    try {
        conn = await pool.getConnection();
        const data = await conn.query(`SELECT password,studentID FROM student WHERE studentID=?`, [id]);

        if (!data[0]) return res.status(400).send("BAD REQUEST.");
        
        if (!data[0].pass && pass==id) { 
            res.send("true")
        } else {
            const hash = data[0].pass;

            if (await checkPassword(pass, hash)) {
                res.send("true");
            } else {
                res.send("false");
            }
        }
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

router.put("/fp", async(req, res) => {
    const { newPass, id } = req.body;

    if (!newPass || !id) return res.status(400).send("BAD REQUEST.");
    
    const hash = await hashPassword(newPass);

    let conn;
    try {
        conn = await pool.getConnection();
        conn.query("UPDATE SET pass=? WHERE id=?", [hash, id]);
        res.send("PASSOWRD UPDATED SUCCESSFULLY.");
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