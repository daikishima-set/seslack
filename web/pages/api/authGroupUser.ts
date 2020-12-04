import query from "utils/Query";
import { typeMember } from "ts/type";

export default async (req, res) => {
  const groupTag: string = req.body.groupTag;
  const name: string = req.body.name;

  try {
    if (!groupTag || !name) {
      throw new Error(`引数エラー[${groupTag} : ${name}]`);
    }

    // スレッド一覧
    let sql: string = `
      SELECT 1 FROM m_member WHERE group_id = (
        SELECT id FROM m_group WHERE tag = ?
      ) and user_id = (
        SELECT id FROM m_user WHERE name = ?
      );
  `;

    let result: typeMember[] = await query(sql, [groupTag, name]);
    res.statusCode = 200;
    if (result) {
      res.json({ msg: true });
    } else {
      res.json({ msg: false });
    }
  } catch (e) {
    res.statusCode = 400;
    res.json({ msg: e.message });
  }
};
