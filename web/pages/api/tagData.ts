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
    const key: string = req.body.key;

    if (!groupTag || !key) {
        throw new Error(`引数エラー[${groupTag} : ${key}]`)
    }

    // タグ情報
    const sql: string = `
      SELECT 
        t.id as id, 
        u.name, 
        t.message, 
        DATE_FORMAT(t.updated_at,'%Y-%m-%d %H:%i:%s') as updated_at, 
        GROUP_CONCAT(CONCAT(tag.id, ":", tag.name)) as tag 
      FROM (
        SELECT * from (
          SELECT 
            timeline.* from t_tag as tag 
          INNER JOIN t_timeline as timeline ON tag.timeline_id = timeline.id and timeline.is_delete = false
          WHERE name = ?
          GROUP BY timeline.id
        ) as t 
        WHERE t.thread_id in ( 
          SELECT
            id 
          FROM m_thread 
          WHERE group_id in ( 
            SELECT 
              id 
            FROM
              m_group 
            WHERE
              tag = ?
          )
        )
      ) as t 
      INNER JOIN m_user as u ON t.user_id = u.id 
      LEFT JOIN t_tag as tag ON t.id = tag.timeline_id 
      GROUP BY t.id, u.name, t.message, t.updated_at;
    `;
    let result = await query(sql, [key, groupTag]);
    let timeline_list: typeResult[] = [];
    if (result) {
      timeline_list = result.map((data) => {
        let tagList = [];
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
      threadName: key,
      timeline: timeline_list,
    });
  } catch (e) {
    res.statusCode = 400;
    res.json({ msg: e.message });
  }
};
