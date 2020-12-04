import query from "utils/Query";

export default async (req, res) => {
  try {
    const timelineId: number = req.body.timelineId;
    const tagName: string = req.body.tagName;
    if (!timelineId || !tagName) {
      throw new Error(`引数エラー[${timelineId} : ${tagName}]`);
    }

    let sql: string = `SELECT 1 FROM t_tag WHERE timeline_id = ? and name = ?`;
    const result: object = await query(sql, [timelineId, tagName]);
    if (result) {
      throw new Error("既にタグが存在");
    }

    sql = `INSERT INTO t_tag(timeline_id,name,created_at,updated_at) VALUES(?,?,now(),now())`;
    await query(sql, [timelineId, tagName]);

    res.statusCode = 200;
    res.json({ msg: "success" });
  } catch (e) {
    res.statusCode = 400;
    res.json({ msg: e.message });
  }
};
