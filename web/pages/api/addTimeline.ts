import query from "utils/Query";

export default async (req, res) => {
  try {
    const user: string = req.body.user;
    const threadTag: string = req.body.threadTag;
    const message: string = req.body.message;

    if (!user || !message || !threadTag) {
      throw new Error(`引数エラー[${user} : ${message} : ${threadTag}]`);
    }

    let sql: string = `SELECT id FROM m_user WHERE name = ?`;

    let result = await query(sql, [user]);
    let userId: number = 0;
    if (result) {
      userId = result[0].id;
    } else {
      throw new Error("存在しないユーザ")
    }

    sql = `SELECT id FROM m_thread WHERE tag = ?`;

    result = await query(sql, [threadTag]);
    let threadId: number = 0;
    if (result) {
      threadId = result[0].id;
    } else {
      throw new Error("存在しないスレッド")
    }

    result = await query(
      "INSERT INTO t_timeline(`user_id`,`thread_id`,`message`,`created_at`,`updated_at`) VALUES(?,?,?,now(),now())",
      [userId, threadId, message]
    );

    res.statusCode = 200;
    res.json({ msg: "success" });
  } catch (e) {
    res.statusCode = 400;
    res.json({ msg: e.message });
  }
};
