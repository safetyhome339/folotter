const express = require('express');
const sql = require('mssql');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 8080;
// إعداد CORS
app.use(cors());
// إعداد body-parser
app.use(bodyParser.json());

// إعداد اتصال SQL Server
const dbConfig = {
    user: 'db_aadb1b_school001_admin',
    password: 'osama%2003%',
    server: 'sql5110.site4now.net', // مثل myserver.database.windows.net
    database: 'db_aadb1b_school001',
    options: {
        encrypt: true, // مطلوب لـ Azure
        trustServerCertificate: true // استخدم فقط في بيئات التطوير
    }
};

app.post('/login', async (req, res) => {
    const { username, password } = req.body; // استخدم 'password' بدلاً من 'passward'
    try {
        let pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .input('username', sql.VarChar, username)
            .input('password', sql.VarChar, password)
            .query('SELECT * FROM users_tb WHERE username = @username AND passward = @password');

        if (result.recordset.length > 0) {
            const user = result.recordset[0];
            res.status(200).json({ user_type: user.user_type });
        } else {
            res.status(401).send('اسم المستخدم أو كلمة المرور غير صحيحة');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
});
// ------------------- Users_tb -------------------
// عرض جميع المستخدمين
app.get('/users', async (req, res) => {
    try {
        let pool = await sql.connect(dbConfig);
        let result = await pool.request().query('SELECT * FROM Users_tb');
        res.status(200).json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
});

// إضافة مستخدم
app.post('/users', async (req, res) => {
    const { User_name, User_password, User_type } = req.body;
    try {
        let pool = await sql.connect(dbConfig);
        await pool.request()
            .input('User_name', sql.VarChar, User_name)
            .input('User_password', sql.VarChar, User_password)
            .input('User_type', sql.VarChar, User_type)
            .query('INSERT INTO Users_tb (User_name, User_password, User_type) VALUES (@User_name, @User_password, @User_type)');
        res.status(201).send({ User_name });
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
});

// تعديل مستخدم
app.put('/users/:User_id', async (req, res) => {
    const { User_id } = req.params;
    const { User_name, User_password, User_type } = req.body;
    try {
        let pool = await sql.connect(dbConfig);
        await pool.request()
            .input('User_id', sql.Int, User_id)
            .input('User_name', sql.VarChar, User_name)
            .input('User_password', sql.VarChar, User_password)
            .input('User_type', sql.VarChar, User_type)
            .query('UPDATE Users_tb SET User_name = @User_name, User_password = @User_password, User_type = @User_type WHERE User_id = @User_id');
        res.status(200).send({ User_id });
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
});

// حذف مستخدم
app.delete('/users/:User_id', async (req, res) => {
    const { User_id } = req.params;
    try {
        let pool = await sql.connect(dbConfig);
        await pool.request()
            .input('User_id', sql.Int, User_id)
            .query('DELETE FROM Users_tb WHERE User_id = @User_id');
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
});

// ------------------- Students_tb -------------------
// عرض جميع الطلاب
app.get('/students', async (req, res) => {
    try {
        let pool = await sql.connect(dbConfig);
        let result = await pool.request().query('SELECT * FROM Students_tb');
        res.status(200).json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
});

// إضافة طالب
app.post('/students', async (req, res) => {
    const { Student_name, Class_id, gander, guardian_number, User_id } = req.body;
    try {
        let pool = await sql.connect(dbConfig);
        await pool.request()
            .input('Student_name', sql.VarChar, Student_name)
            .input('Class_id', sql.Int, Class_id)
            .input('gander', sql.VarChar, gander)
            .input('guardian_number', sql.VarChar, guardian_number)
            .input('User_id', sql.Int, User_id)
            .query('INSERT INTO Students_tb (Student_name, Class_id, gander, guardian_number, User_id) VALUES (@Student_name, @Class_id, @gander, @guardian_number, @User_id)');
        res.status(201).send({ Student_name });
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
});

// تعديل طالب
app.put('/students/:Student_id', async (req, res) => {
    const { Student_id } = req.params;
    const { Student_name, Class_id, gander, guardian_number, User_id } = req.body;
    try {
        let pool = await sql.connect(dbConfig);
        await pool.request()
            .input('Student_id', sql.Int, Student_id)
            .input('Student_name', sql.VarChar, Student_name)
            .input('Class_id', sql.Int, Class_id)
            .input('gander', sql.VarChar, gander)
            .input('guardian_number', sql.VarChar, guardian_number)
            .input('User_id', sql.Int, User_id)
            .query('UPDATE Students_tb SET Student_name = @Student_name, Class_id = @Class_id, gander = @gander, guardian_number = @guardian_number, User_id = @User_id WHERE Student_id = @Student_id');
        res.status(200).send({ Student_id });
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
});

// حذف طالب
app.delete('/students/:Student_id', async (req, res) => {
    const { Student_id } = req.params;
    try {
        let pool = await sql.connect(dbConfig);
        await pool.request()
            .input('Student_id', sql.Int, Student_id)
            .query('DELETE FROM Students_tb WHERE Student_id = @Student_id');
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
});

// ------------------- StudySubject_tb -------------------
// عرض جميع المواد الدراسية
app.get('/study-subjects', async (req, res) => {
    try {
        let pool = await sql.connect(dbConfig);
        let result = await pool.request().query('SELECT * FROM StudySubject_tb');
        res.status(200).json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
});

// إضافة مادة دراسية
app.post('/study-subjects', async (req, res) => {
    const { subject_name } = req.body;
    try {
        let pool = await sql.connect(dbConfig);
        await pool.request()
            .input('subject_name', sql.VarChar, subject_name)
            .query('INSERT INTO StudySubject_tb (subject_name) VALUES (@subject_name)');
        res.status(201).send({ subject_name });
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
});

// تعديل مادة دراسية
app.put('/study-subjects/:subject_id', async (req, res) => {
    const { subject_id } = req.params;
    const { subject_name } = req.body;
    try {
        let pool = await sql.connect(dbConfig);
        await pool.request()
            .input('subject_id', sql.Int, subject_id)
            .input('subject_name', sql.VarChar, subject_name)
            .query('UPDATE StudySubject_tb SET subject_name = @subject_name WHERE subject_id = @subject_id');
        res.status(200).send({ subject_id });
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
});

// حذف مادة دراسية
app.delete('/study-subjects/:subject_id', async (req, res) => {
    const { subject_id } = req.params;
    try {
        let pool = await sql.connect(dbConfig);
        await pool.request()
            .input('subject_id', sql.Int, subject_id)
            .query('DELETE FROM StudySubject_tb WHERE subject_id = @subject_id');
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
});

// ------------------- Notifications_tb -------------------
// العمليات على الإشعارات
app.get('/notifications', async (req, res) => {
    try {
        let pool = await sql.connect(dbConfig);
        let result = await pool.request().query('SELECT * FROM Notifications_tb');
        res.status(200).json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
});

app.post('/notifications', async (req, res) => {
    const { Notification_name, Vertical_Im, Horizontal_Im, Supervisor_Id } = req.body;
    try {
        let pool = await sql.connect(dbConfig);
        await pool.request()
            .input('Notification_name', sql.VarChar, Notification_name)
            .input('Vertical_Im', sql.Int, Vertical_Im)
            .input('Horizontal_Im', sql.Int, Horizontal_Im)
            .input('Supervisor_Id', sql.Int, Supervisor_Id)
            .query('INSERT INTO Notifications_tb (Notification_name, Vertical_Im, Horizontal_Im, Supervisor_Id) VALUES (@Notification_name, @Vertical_Im, @Horizontal_Im, @Supervisor_Id)');
        res.status(201).send({ Notification_name });
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
});

// تعديل إشعار
app.put('/notifications/:Notification_Id', async (req, res) => {
    const { Notification_Id } = req.params;
    const { Notification_name, Vertical_Im, Horizontal_Im, Supervisor_Id } = req.body;
    try {
        let pool = await sql.connect(dbConfig);
        await pool.request()
            .input('Notification_Id', sql.Int, Notification_Id)
            .input('Notification_name', sql.VarChar, Notification_name)
            .input('Vertical_Im', sql.Int, Vertical_Im)
            .input('Horizontal_Im', sql.Int, Horizontal_Im)
            .input('Supervisor_Id', sql.Int, Supervisor_Id)
            .query('UPDATE Notifications_tb SET Notification_name = @Notification_name, Vertical_Im = @Vertical_Im, Horizontal_Im = @Horizontal_Im, Supervisor_Id = @Supervisor_Id WHERE Notification_Id = @Notification_Id');
        res.status(200).send({ Notification_Id });
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
});

// حذف إشعار
app.delete('/notifications/:Notification_Id', async (req, res) => {
    const { Notification_Id } = req.params;
    try {
        let pool = await sql.connect(dbConfig);
        await pool.request()
            .input('Notification_Id', sql.Int, Notification_Id)
            .query('DELETE FROM Notifications_tb WHERE Notification_Id = @Notification_Id');
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
});

// ------------------- Years_tb -------------------
// العمليات على السنوات
app.get('/years', async (req, res) => {
    try {
        let pool = await sql.connect(dbConfig);
        let result = await pool.request().query('SELECT * FROM Years_tb');
        res.status(200).json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
});

app.post('/years', async (req, res) => {
    const { years_name } = req.body;
    try {
        let pool = await sql.connect(dbConfig);
        await pool.request()
            .input('years_name', sql.VarChar, years_name)
            .query('INSERT INTO Years_tb (years_name) VALUES (@years_name)');
        res.status(201).send({ years_name });
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
});

// تعديل سنة
app.put('/years/:years_id', async (req, res) => {
    const { years_id } = req.params;
    const { years_name } = req.body;
    try {
        let pool = await sql.connect(dbConfig);
        await pool.request()
            .input('years_id', sql.Int, years_id)
            .input('years_name', sql.VarChar, years_name)
            .query('UPDATE Years_tb SET years_name = @years_name WHERE years_id = @years_id');
        res.status(200).send({ years_id });
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
});

// حذف سنة
app.delete('/years/:years_id', async (req, res) => {
    const { years_id } = req.params;
    try {
        let pool = await sql.connect(dbConfig);
        await pool.request()
            .input('years_id', sql.Int, years_id)
            .query('DELETE FROM Years_tb WHERE years_id = @years_id');
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
});

// ------------------- Month_tb -------------------
// العمليات على الأشهر
app.get('/months', async (req, res) => {
    try {
        let pool = await sql.connect(dbConfig);
        let result = await pool.request().query('SELECT * FROM Month_tb');
        res.status(200).json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
});

app.post('/months', async (req, res) => {
    const { month_name, years_id } = req.body;
    try {
        let pool = await sql.connect(dbConfig);
        await pool.request()
            .input('month_name', sql.VarChar, month_name)
            .input('years_id', sql.Int, years_id)
            .query('INSERT INTO Month_tb (month_name, years_id) VALUES (@month_name, @years_id)');
        res.status(201).send({ month_name });
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
});

// تعديل شهر
app.put('/months/:month_id', async (req, res) => {
    const { month_id } = req.params;
    const { month_name, years_id } = req.body;
    try {
        let pool = await sql.connect(dbConfig);
        await pool.request()
            .input('month_id', sql.Int, month_id)
            .input('month_name', sql.VarChar, month_name)
            .input('years_id', sql.Int, years_id)
            .query('UPDATE Month_tb SET month_name = @month_name, years_id = @years_id WHERE month_id = @month_id');
        res.status(200).send({ month_id });
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
});

// حذف شهر
app.delete('/months/:month_id', async (req, res) => {
    const { month_id } = req.params;
    try {
        let pool = await sql.connect(dbConfig);
        await pool.request()
            .input('month_id', sql.Int, month_id)
            .query('DELETE FROM Month_tb WHERE month_id = @month_id');
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
});

// ------------------- Week_tb -------------------
// العمليات على الأسابيع
app.get('/weeks', async (req, res) => {
    try {
        let pool = await sql.connect(dbConfig);
        let result = await pool.request().query('SELECT * FROM Week_tb');
        res.status(200).json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
});

app.post('/weeks', async (req, res) => {
    const { Week_name, month_id } = req.body;
    try {
        let pool = await sql.connect(dbConfig);
        await pool.request()
            .input('Week_name', sql.VarChar, Week_name)
            .input('month_id', sql.Int, month_id)
            .query('INSERT INTO Week_tb (Week_name, month_id) VALUES (@Week_name, @month_id)');
        res.status(201).send({ Week_name });
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
});

// تعديل أسبوع
app.put('/weeks/:Week_id', async (req, res) => {
    const { Week_id } = req.params;
    const { Week_name, month_id } = req.body;
    try {
        let pool = await sql.connect(dbConfig);
        await pool.request()
            .input('Week_id', sql.Int, Week_id)
            .input('Week_name', sql.VarChar, Week_name)
            .input('month_id', sql.Int, month_id)
            .query('UPDATE Week_tb SET Week_name = @Week_name, month_id = @month_id WHERE Week_id = @Week_id');
        res.status(200).send({ Week_id });
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
});

// حذف أسبوع
app.delete('/weeks/:Week_id', async (req, res) => {
    const { Week_id } = req.params;
    try {
        let pool = await sql.connect(dbConfig);
        await pool.request()
            .input('Week_id', sql.Int, Week_id)
            .query('DELETE FROM Week_tb WHERE Week_id = @Week_id');
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
});
// ------------------- Day_tb -------------------
// عرض جميع الأيام
app.get('/days', async (req, res) => {
    try {
        let pool = await sql.connect(dbConfig);
        let result = await pool.request().query('SELECT * FROM Day_tb');
        res.status(200).json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
});

// إضافة يوم
app.post('/days', async (req, res) => {
    const { Day_name, Week_id } = req.body;
    try {
        let pool = await sql.connect(dbConfig);
        await pool.request()
            .input('Day_name', sql.VarChar, Day_name)
            .input('Week_id', sql.Int, Week_id)
            .query('INSERT INTO Day_tb (Day_name, Week_id) VALUES (@Day_name, @Week_id)');
        res.status(201).send({ Day_name });
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
});

// تعديل يوم
app.put('/days/:Day_id', async (req, res) => {
    const { Day_id } = req.params;
    const { Day_name, Week_id } = req.body;
    try {
        let pool = await sql.connect(dbConfig);
        await pool.request()
            .input('Day_id', sql.Int, Day_id)
            .input('Day_name', sql.VarChar, Day_name)
            .input('Week_id', sql.Int, Week_id)
            .query('UPDATE Day_tb SET Day_name = @Day_name, Week_id = @Week_id WHERE Day_id = @Day_id');
        res.status(200).send({ Day_id });
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
});

// حذف يوم
app.delete('/days/:Day_id', async (req, res) => {
    const { Day_id } = req.params;
    try {
        let pool = await sql.connect(dbConfig);
        await pool.request()
            .input('Day_id', sql.Int, Day_id)
            .query('DELETE FROM Day_tb WHERE Day_id = @Day_id');
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
});

// ------------------- Classes_tb -------------------
// عرض جميع الفصول
app.get('/classes', async (req, res) => {
    try {
        let pool = await sql.connect(dbConfig);
        let result = await pool.request().query('SELECT * FROM Classes_tb');
        res.status(200).json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
});

// إضافة فصل
app.post('/classes', async (req, res) => {
    const { Class_name } = req.body;
    try {
        let pool = await sql.connect(dbConfig);
        await pool.request()
            .input('Class_name', sql.VarChar, Class_name)
            .query('INSERT INTO Classes_tb (Class_name) VALUES (@Class_name)');
        res.status(201).send({ Class_name });
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
});

// تعديل فصل
app.put('/classes/:Class_id', async (req, res) => {
    const { Class_id } = req.params;
    const { Class_name } = req.body;
    try {
        let pool = await sql.connect(dbConfig);
        await pool.request()
            .input('Class_id', sql.Int, Class_id)
            .input('Class_name', sql.VarChar, Class_name)
            .query('UPDATE Classes_tb SET Class_name = @Class_name WHERE Class_id = @Class_id');
        res.status(200).send({ Class_id });
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
});

// حذف فصل
app.delete('/classes/:Class_id', async (req, res) => {
    const { Class_id } = req.params;
    try {
        let pool = await sql.connect(dbConfig);
        await pool.request()
            .input('Class_id', sql.Int, Class_id)
            .query('DELETE FROM Classes_tb WHERE Class_id = @Class_id');
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
});

// ------------------- Account_tb -------------------
// عرض جميع الحسابات
app.get('/accounts', async (req, res) => {
    try {
        let pool = await sql.connect(dbConfig);
        let result = await pool.request().query('SELECT * FROM Account_tb');
        res.status(200).json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
});

// إضافة حساب
app.post('/accounts', async (req, res) => {
    const { Total_fees, Total_paid, Residual, User_id } = req.body;
    try {
        let pool = await sql.connect(dbConfig);
        await pool.request()
            .input('Total_fees', sql.Float, Total_fees)
            .input('Total_paid', sql.Float, Total_paid)
            .input('Residual', sql.Float, Residual)
            .input('User_id', sql.Int, User_id)
            .query('INSERT INTO Account_tb (Total_fees, Total_paid, Residual, User_id) VALUES (@Total_fees, @Total_paid, @Residual, @User_id)');
        res.status(201).send({ Total_fees });
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
});

// تعديل حساب
app.put('/accounts/:Account_id', async (req, res) => {
    const { Account_id } = req.params;
    const { Total_fees, Total_paid, Residual, User_id } = req.body;
    try {
        let pool = await sql.connect(dbConfig);
        await pool.request()
            .input('Account_id', sql.Int, Account_id)
            .input('Total_fees', sql.Float, Total_fees)
            .input('Total_paid', sql.Float, Total_paid)
            .input('Residual', sql.Float, Residual)
            .input('User_id', sql.Int, User_id)
            .query('UPDATE Account_tb SET Total_fees = @Total_fees, Total_paid = @Total_paid, Residual = @Residual, User_id = @User_id WHERE Account_id = @Account_id');
        res.status(200).send({ Account_id });
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
});

// حذف حساب
app.delete('/accounts/:Account_id', async (req, res) => {
    const { Account_id } = req.params;
    try {
        let pool = await sql.connect(dbConfig);
        await pool.request()
            .input('Account_id', sql.Int, Account_id)
            .query('DELETE FROM Account_tb WHERE Account_id = @Account_id');
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
});

// ------------------- Teachers_tb -------------------
// عرض جميع المعلمين
app.get('/teachers', async (req, res) => {
    try {
        let pool = await sql.connect(dbConfig);
        let result = await pool.request().query('SELECT * FROM Teachers_tb');
        res.status(200).json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
});

// إضافة معلم
app.post('/teachers', async (req, res) => {
    const { teacher_name, teacher_number, Specialization, User_id } = req.body;
    try {
        let pool = await sql.connect(dbConfig);
        await pool.request()
            .input('teacher_name', sql.VarChar, teacher_name)
            .input('teacher_number', sql.VarChar, teacher_number)
            .input('Specialization', sql.VarChar, Specialization)
            .input('User_id', sql.Int, User_id)
            .query('INSERT INTO Teachers_tb (teacher_name, teacher_number, Specialization, User_id) VALUES (@teacher_name, @teacher_number, @Specialization, @User_id)');
        res.status(201).send({ teacher_name });
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
});

// تعديل معلم
app.put('/teachers/:teacher_id', async (req, res) => {
    const { teacher_id } = req.params;
    const { teacher_name, teacher_number, Specialization, User_id } = req.body;
    try {
        let pool = await sql.connect(dbConfig);
        await pool.request()
            .input('teacher_id', sql.Int, teacher_id)
            .input('teacher_name', sql.VarChar, teacher_name)
            .input('teacher_number', sql.VarChar, teacher_number)
            .input('Specialization', sql.VarChar, Specialization)
            .input('User_id', sql.Int, User_id)
            .query('UPDATE Teachers_tb SET teacher_name = @teacher_name, teacher_number = @teacher_number, Specialization = @Specialization, User_id = @User_id WHERE teacher_id = @teacher_id');
        res.status(200).send({ teacher_id });
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
});

// حذف معلم
app.delete('/teachers/:teacher_id', async (req, res) => {
    const { teacher_id } = req.params;
    try {
        let pool = await sql.connect(dbConfig);
        await pool.request()
            .input('teacher_id', sql.Int, teacher_id)
            .query('DELETE FROM Teachers_tb WHERE teacher_id = @teacher_id');
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
});

// ------------------- SchoolBook_tb -------------------
// عرض جميع الكتب المدرسية
app.get('/school-books', async (req, res) => {
    try {
        let pool = await sql.connect(dbConfig);
        let result = await pool.request().query('SELECT * FROM SchoolBook_tb');
        res.status(200).json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
});

// إضافة كتاب مدرسي
app.post('/school-books', async (req, res) => {
    const { Class_id, Subject_id, File } = req.body;
    try {
        let pool = await sql.connect(dbConfig);
        await pool.request()
            .input('Class_id', sql.Int, Class_id)
            .input('Subject_id', sql.Int, Subject_id)
            .input('File', sql.VarChar, File)
            .query('INSERT INTO SchoolBook_tb (Class_id, Subject_id, File) VALUES (@Class_id, @Subject_id, @File)');
        res.status(201).send({ Class_id });
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
});

// تعديل كتاب مدرسي
app.put('/school-books/:School_book_id', async (req, res) => {
    const { School_book_id } = req.params;
    const { Class_id, Subject_id, File } = req.body;
    try {
        let pool = await sql.connect(dbConfig);
        await pool.request()
            .input('School_book_id', sql.Int, School_book_id)
            .input('Class_id', sql.Int, Class_id)
            .input('Subject_id', sql.Int, Subject_id)
            .input('File', sql.VarChar, File)
            .query('UPDATE SchoolBook_tb SET Class_id = @Class_id, Subject_id = @Subject_id, File = @File WHERE School_book_id = @School_book_id');
        res.status(200).send({ School_book_id });
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
});

// حذف كتاب مدرسي
app.delete('/school-books/:School_book_id', async (req, res) => {
    const { School_book_id } = req.params;
    try {
        let pool = await sql.connect(dbConfig);
        await pool.request()
            .input('School_book_id', sql.Int, School_book_id)
            .query('DELETE FROM SchoolBook_tb WHERE School_book_id = @School_book_id');
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
});

// ------------------- Divisions_tb -------------------
// عرض جميع الأقسام
app.get('/divisions', async (req, res) => {
    try {
        let pool = await sql.connect(dbConfig);
        let result = await pool.request().query('SELECT * FROM Divisions_tb');
        res.status(200).json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
});

// إضافة قسم
app.post('/divisions', async (req, res) => {
    const { division_name, Class_id, Subject_id, teacher_id, Class_schedule, Test_schedule } = req.body;
    try {
        let pool = await sql.connect(dbConfig);
        await pool.request()
            .input('division_name', sql.VarChar, division_name)
            .input('Class_id', sql.Int, Class_id)
            .input('Subject_id', sql.Int, Subject_id)
            .input('teacher_id', sql.Int, teacher_id)
            .input('Class_schedule', sql.VarChar, Class_schedule)
            .input('Test_schedule', sql.VarChar, Test_schedule)
            .query('INSERT INTO Divisions_tb (division_name, Class_id, Subject_id, teacher_id, Class_schedule, Test_schedule) VALUES (@division_name, @Class_id, @Subject_id, @teacher_id, @Class_schedule, @Test_schedule)');
        res.status(201).send({ division_name });
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
});

// تعديل قسم
app.put('/divisions/:division_id', async (req, res) => {
    const { division_id } = req.params;
    const { division_name, Class_id, Subject_id, teacher_id, Class_schedule, Test_schedule } = req.body;
    try {
        let pool = await sql.connect(dbConfig);
        await pool.request()
            .input('division_id', sql.Int, division_id)
            .input('division_name', sql.VarChar, division_name)
            .input('Class_id', sql.Int, Class_id)
            .input('Subject_id', sql.Int, Subject_id)
            .input('teacher_id', sql.Int, teacher_id)
            .input('Class_schedule', sql.VarChar, Class_schedule)
            .input('Test_schedule', sql.VarChar, Test_schedule)
            .query('UPDATE Divisions_tb SET division_name = @division_name, Class_id = @Class_id, Subject_id = @Subject_id, teacher_id = @teacher_id, Class_schedule = @Class_schedule, Test_schedule = @Test_schedule WHERE division_id = @division_id');
        res.status(200).send({ division_id });
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
});

// حذف قسم
app.delete('/divisions/:division_id', async (req, res) => {
    const { division_id } = req.params;
    try {
        let pool = await sql.connect(dbConfig);
        await pool.request()
            .input('division_id', sql.Int, division_id)
            .query('DELETE FROM Divisions_tb WHERE division_id = @division_id');
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
});

// ------------------- Notebook_tb -------------------
// عرض جميع دفاتر الملاحظات
app.get('/notebooks', async (req, res) => {
    try {
        let pool = await sql.connect(dbConfig);
        let result = await pool.request().query('SELECT * FROM notebook_tb');
        res.status(200).json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
});

// إضافة دفتر ملاحظات
app.post('/notebooks', async (req, res) => {
    const { Student_id, Subject_id, notes, Lessons_homework, Day_id, division_id, supervisor_id, teacher_id } = req.body;
    try {
        let pool = await sql.connect(dbConfig);
        await pool.request()
            .input('Student_id', sql.Int, Student_id)
            .input('Subject_id', sql.Int, Subject_id)
            .input('notes', sql.VarChar, notes)
            .input('Lessons_homework', sql.VarChar, Lessons_homework)
            .input('Day_id', sql.Int, Day_id)
            .input('division_id', sql.Int, division_id)
            .input('supervisor_id', sql.Int, supervisor_id)
            .input('teacher_id', sql.Int, teacher_id)
            .query('INSERT INTO notebook_tb (Student_id, Subject_id, notes, Lessons_homework, Day_id, division_id, supervisor_id, teacher_id) VALUES (@Student_id, @Subject_id, @notes, @Lessons_homework, @Day_id, @division_id, @supervisor_id, @teacher_id)');
        res.status(201).send({ Student_id });
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
});

// تعديل دفتر ملاحظات
app.put('/notebooks/:Notebook_id', async (req, res) => {
    const { Notebook_id } = req.params;
    const { Student_id, Subject_id, notes, Lessons_homework, Day_id, division_id, supervisor_id, teacher_id } = req.body;
    try {
        let pool = await sql.connect(dbConfig);
        await pool.request()
            .input('Notebook_id', sql.Int, Notebook_id)
            .input('Student_id', sql.Int, Student_id)
            .input('Subject_id', sql.Int, Subject_id)
            .input('notes', sql.VarChar, notes)
            .input('Lessons_homework', sql.VarChar, Lessons_homework)
            .input('Day_id', sql.Int, Day_id)
            .input('division_id', sql.Int, division_id)
            .input('supervisor_id', sql.Int, supervisor_id)
            .input('teacher_id', sql.Int, teacher_id)
            .query('UPDATE notebook_tb SET Student_id = @Student_id, Subject_id = @Subject_id, notes = @notes, Lessons_homework = @Lessons_homework, Day_id = @Day_id, division_id = @division_id, supervisor_id = @supervisor_id, teacher_id = @teacher_id WHERE Notebook_id = @Notebook_id');
        res.status(200).send({ Notebook_id });
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
});

// حذف دفتر ملاحظات
app.delete('/notebooks/:Notebook_id', async (req, res) => {
    const { Notebook_id } = req.params;
    try {
        let pool = await sql.connect(dbConfig);
        await pool.request()
            .input('Notebook_id', sql.Int, Notebook_id)
            .query('DELETE FROM notebook_tb WHERE Notebook_id = @Notebook_id');
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
});

// ------------------- Supervisor_Notebook_tb -------------------
// عرض جميع دفاتر ملاحظات المشرف
app.get('/supervisor-notebooks', async (req, res) => {
    try {
        let pool = await sql.connect(dbConfig);
        let result = await pool.request().query('SELECT * FROM supervisor_notebook_tb');
        res.status(200).json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
});

// إضافة دفتر ملاحظات مشرف
app.post('/supervisor-notebooks', async (req, res) => {
    const { Premce, Student_id, Class_id, notes, Day_id, User_id, division_id } = req.body;
    try {
        let pool = await sql.connect(dbConfig);
        await pool.request()
            .input('Premce', sql.VarChar, Premce)
            .input('Student_id', sql.Int, Student_id)
            .input('Class_id', sql.Int, Class_id)
            .input('notes', sql.VarChar, notes)
            .input('Day_id', sql.Int, Day_id)
            .input('User_id', sql.Int, User_id)
            .input('division_id', sql.Int, division_id)
            .query('INSERT INTO supervisor_notebook_tb (Premce, Student_id, Class_id, notes, Day_id, User_id, division_id) VALUES (@Premce, @Student_id, @Class_id, @notes, @Day_id, @User_id, @division_id)');
        res.status(201).send({ Premce });
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
});

// تعديل دفتر ملاحظات مشرف
app.put('/supervisor-notebooks/:Supervisor_id', async (req, res) => {
    const { Supervisor_id } = req.params;
    const { Premce, Student_id, Class_id, notes, Day_id, User_id, division_id } = req.body;
    try {
        let pool = await sql.connect(dbConfig);
        await pool.request()
            .input('Supervisor_id', sql.Int, Supervisor_id)
            .input('Premce', sql.VarChar, Premce)
            .input('Student_id', sql.Int, Student_id)
            .input('Class_id', sql.Int, Class_id)
            .input('notes', sql.VarChar, notes)
            .input('Day_id', sql.Int, Day_id)
            .input('User_id', sql.Int, User_id)
            .input('division_id', sql.Int, division_id)
            .query('UPDATE supervisor_notebook_tb SET Premce = @Premce, Student_id = @Student_id, Class_id = @Class_id, notes = @notes, Day_id = @Day_id, User_id = @User_id, division_id = @division_id WHERE Supervisor_id = @Supervisor_id');
        res.status(200).send({ Supervisor_id });
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
});

// حذف دفتر ملاحظات مشرف
app.delete('/supervisor-notebooks/:Supervisor_id', async (req, res) => {
    const { Supervisor_id } = req.params;
    try {
        let pool = await sql.connect(dbConfig);
        await pool.request()
            .input('Supervisor_id', sql.Int, Supervisor_id)
            .query('DELETE FROM supervisor_notebook_tb WHERE Supervisor_id = @Supervisor_id');
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
});

// ------------------- Degrees_tb -------------------
// عرض جميع الدرجات
app.get('/degrees', async (req, res) => {
    try {
        let pool = await sql.connect(dbConfig);
        let result = await pool.request().query('SELECT * FROM degrees_tb');
        res.status(200).json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
});

// إضافة درجة
app.post('/degrees', async (req, res) => {
    const { Student_id, Subject_id, Month_number, Month_name, Oarl, homework, Final, Total, Total_subject, Average } = req.body;
    try {
        let pool = await sql.connect(dbConfig);
        await pool.request()
            .input('Student_id', sql.Int, Student_id)
            .input('Subject_id', sql.Int, Subject_id)
            .input('Month_number', sql.Int, Month_number)
            .input('Month_name', sql.VarChar, Month_name)
            .input('Oarl', sql.Float, Oarl)
            .input('homework', sql.Float, homework)
            .input('Final', sql.Float, Final)
            .input('Total', sql.Float, Total)
            .input('Total_subject', sql.Float, Total_subject)
            .input('Average', sql.Float, Average)
            .query('INSERT INTO degrees_tb (Student_id, Subject_id, Month_number, Month_name, Oarl, homework, Final, Total, Total_subject, Average) VALUES (@Student_id, @Subject_id, @Month_number, @Month_name, @Oarl, @homework, @Final, @Total, @Total_subject, @Average)');
        res.status(201).send({ Student_id });
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
});

// تعديل درجة
app.put('/degrees/:degree_id', async (req, res) => {
    const { degree_id } = req.params;
    const { Student_id, Subject_id, Month_number, Month_name, Oarl, homework, Final, Total, Total_subject, Average } = req.body;
    try {
        let pool = await sql.connect(dbConfig);
        await pool.request()
            .input('degree_id', sql.Int, degree_id)
            .input('Student_id', sql.Int, Student_id)
            .input('Subject_id', sql.Int, Subject_id)
            .input('Month_number', sql.Int, Month_number)
            .input('Month_name', sql.VarChar, Month_name)
            .input('Oarl', sql.Float, Oarl)
            .input('homework', sql.Float, homework)
            .input('Final', sql.Float, Final)
            .input('Total', sql.Float, Total)
            .input('Total_subject', sql.Float, Total_subject)
            .input('Average', sql.Float, Average)
            .query('UPDATE degrees_tb SET Student_id = @Student_id, Subject_id = @Subject_id, Month_number = @Month_number, Month_name = @Month_name, Oarl = @Oarl, homework = @homework, Final = @Final, Total = @Total, Total_subject = @Total_subject, Average = @Average WHERE degree_id = @degree_id');
        res.status(200).send({ degree_id });
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
});

// حذف درجة
app.delete('/degrees/:degree_id', async (req, res) => {
    const { degree_id } = req.params;
    try {
        let pool = await sql.connect(dbConfig);
        await pool.request()
            .input('degree_id', sql.Int, degree_id)
            .query('DELETE FROM degrees_tb WHERE degree_id = @degree_id');
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
});

// بدء الخادم
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});