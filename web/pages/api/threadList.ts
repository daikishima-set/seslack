import { typeThread } from "../../ts/type";
import query from "utils/Query";

export default async (req, res) => {
  try {
    const groupTag: string = req.body.groupTag;

    if (!groupTag) {
      throw new Error(`引数エラー[{groupTag}]`);
    }

    // スレッド一覧
    let sql: string = `
      SELECT * FROM m_thread WHERE group_id = (
        SELECT id FROM m_group WHERE tag = ?
      );
  `;

    let result = await query(sql, [groupTag]);
    let thread_list: typeThread[] = [];
    if (result) {
      thread_list = result.map((data) => {
        return {
          id: data.id,
          name: data.name,
          tag: data.tag,
        };
      });
    }

    res.statusCode = 200;
    res.json({
      thread: thread_list,
    });
  } catch (e) {
    res.statusCode = 400;
    res.json({ msg: e.message });
  }
};
