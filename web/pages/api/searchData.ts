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

    // 投稿情報
    let sql: string = `
      SELECT 
        t.id as id, 
        u.name as name, 
        t.message as message, 
        DATE_FORMAT(t.updated_at,'%Y-%m-%d %H:%i:%s') as updated_at,
        GROUP_CONCAT(CONCAT(tag.id, ":", tag.name)) as tag
      FROM t_timeline as t 
      INNER JOIN m_user as u ON t.user_id = u.id
      LEFT JOIN t_tag as tag ON t.id = tag.timeline_id
      WHERE
      t.is_delete = false and
      t.thread_id in (
        SELECT id FROM m_thread WHERE group_id in (
          SELECT id FROM m_group WHERE tag = ?
        )
      )
      and t.message like ?
      GROUP BY t.id, u.name,t.message, t.updated_at;
  `;
    let result = await query(sql, [groupTag, `%${key}%`]);
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

    // タグ情報
    sql = `
    SELECT 
      t.id as id, 
      u.name, 
      t.message, 
      date_format(t.updated_at,'%Y-%m-%d %H:%i:%s') as updated_at, 
      GROUP_CONCAT(CONCAT(tag.id, ":", tag.name)) as tag 
    FROM (
      SELECT * from (
        SELECT 
          timeline.* 
        FROM t_tag as tag 
        INNER JOIN t_timeline as timeline ON tag.timeline_id = timeline.id 
        WHERE name like ?
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
    result = await query(sql, [`%${key}%`, groupTag]);
    if (result) {
      let timeline_list2: typeResult[] = result
        .filter((data) => {
          const list: typeResult[] = timeline_list.filter((d) => {
            if (d.id == data.id) {
              return d;
            }
          });
          if (list.length <= 0) {
            return data;
          }
        })
        .map((data) => {
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
      timeline_list = [...timeline_list, ...timeline_list2];
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
