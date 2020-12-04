import query from "utils/Query";
import Utils from "utils/Utils";
import { typeGroup, typeThread } from "ts/type";

export default async (req, res) => {
  try {
    const threadName: string = req.body.threadName;
    const groupTag: string = req.body.groupTag;
    if (!threadName || !groupTag) {
      throw new Error(`引数エラー[${threadName} : ${groupTag}]`);
    }

    let sql: string = `SELECT * FROM m_group WHERE tag = ? limit 1`;
    let groupData: typeGroup[] = await query(sql, [groupTag]);
    const hash = Utils.getHash(groupData[0].name + "_" + threadName);

    sql = `SELECT 1 FROM m_thread WHERE group_id = ? and name = ?`;
    let result: typeThread[] = await query(sql, [groupData[0].id, threadName]);
    if (result) {
      throw new Error("既にスレッドが存在");
    }

    sql = `INSERT INTO m_thread(group_id,name,tag,created_at,updated_at) VALUES(?,?,?,now(),now())`;
    await query(sql, [groupData[0].id, threadName, hash]);

    res.statusCode = 200;
    res.json({ msg: "success" });
  } catch (e) {
    res.statusCode = 400;
    res.json({ msg: e.message });
  }
};
