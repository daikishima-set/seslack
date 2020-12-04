import { typeThread } from "ts/type";
import query from "utils/Query";

type typeResult = {
  id: number;
  name: string;
  message: string;
  updatedAt: string;
  tagList: string[][];
};

export default async (req, res) => {
  try {
    const groupTag: string = req.body.groupTag;
    const threadTag: string = req.body.threadTag;
    let threadName: string = "";

    if (!groupTag || !threadTag) {
      throw new Error(`引数エラー[{groupTag} : {threadTag}]`)
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
    } else {
      throw new Error("スレッド一覧取得エラー")
    }

    // スレッド名取得
    sql = `SELECT name FROM m_thread WHERE tag = ?`;
    result = await query(sql, [threadTag]);
    if (result) {
      threadName = result[0].name;
    } else {
      throw new Error("スレッド名取得エラー")
    }

    // 投稿情報
    sql = `
      SELECT
        t.id as id, 
        u.name, 
        t.message, 
        DATE_FORMAT(t.updated_at,'%Y-%m-%d %H:%i:%s') as updated_at,
        GROUP_CONCAT(CONCAT(tag.id, ":", tag.name)) as tag
      FROM t_timeline as t 
      INNER JOIN m_user as u ON t.user_id = u.id
      LEFT JOIN t_tag as tag ON t.id = tag.timeline_id
      WHERE 
      t.is_delete = false and
      thread_id = (
        SELECT id FROM m_thread WHERE tag = ?
      )
      GROUP BY t.id, u.name,t.message, t.updated_at;
    `;
    result = await query(sql, [threadTag]);
    let timeline_list: typeResult[] = [];
    if (result) {
      timeline_list = result.map((data) => {
        let tagList: string[][] = [];
        if (data.tag) {
          tagList = data.tag.split(",").map((tagdata) => {
            return tagdata.split(":");
          });
        }
        return {
          id: data.id,
          name: data.name,
          message: data.message,
          updatedAt: data.updated_at,
          tagList: tagList,
        };
      });
    }

    res.statusCode = 200;
    res.json({
      thread: thread_list,
      threadName: threadName,
      threadTag: threadTag,
      timeline: timeline_list,
    });
  } catch (e) {
    res.statusCode = 400;
    res.json({ msg: e.message });
  }
};
