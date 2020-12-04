import query from "utils/Query";

export default async (req, res) => {
  try {
    const user: string = req.body.user;
    const timelineId: string = req.body.timelineId;
    const message: string = req.body.message;

    if (!user || !timelineId || !message) {
      throw new Error(`引数エラー[${user} : ${timelineId} : ${message}]`);
    }

    let sql: string = `SELECT id FROM m_user WHERE name = ?`;

    let result = await query(sql, [user]);
    let userId: number = 0;
    if (result) {
      userId = result[0].id;
    } else {
      throw new Error("存在しないユーザ")
    }

    sql = `SELECT id FROM t_timeline WHERE id = ? and user_id = ?`;

    result = await query(sql, [timelineId, userId]);
    if (!result) {
      throw new Error("存在しないタイムライン")
    }

    result = await query(
      "UPDATE t_timeline SET message = ? WHERE id = ?",
      [message, timelineId]
    );

    res.statusCode = 200;
    res.json({ msg: "success" });
  } catch (e) {
    res.statusCode = 400;
    res.json({ msg: e.message });
  }
};
