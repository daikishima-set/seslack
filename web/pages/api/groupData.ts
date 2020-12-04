import query from "utils/Query";
import { typeGroup } from "ts/type";

type typeResultGroup = {
  id: number;
  name: string;
  tag: string;
};

type typeResultCandGroup = {
  name: string;
};

export default async (req, res) => {
  try {
    const name: string = req.body.name;
    if (!name) {
      throw new Error(`引数エラー[${name}]`);
    }

    let sql: string = `
      SELECT * FROM m_group WHERE id in (
        SELECT group_id FROM m_member WHERE user_id =  (
          SELECT id FROM m_user WHERE name = ?
        )
      );  
    `;
    let result: typeGroup[] = await query(sql, [name]);
    let groupList: typeResultGroup[] = [];
    if (result) {
      groupList = result.map((data: typeGroup) => {
        return {
          id: data.id,
          name: data.name,
          tag: data.tag,
        };
      });
    }

    sql = `SELECT name FROM m_group`;
    result = await query(sql);
    let allGroupList: typeResultCandGroup[] = [];
    if (result) {
      allGroupList = result.map((data: typeGroup) => {
        return {
          name: data.name,
        };
      });
    }

    res.statusCode = 200;
    res.json({
      group: groupList,
      allGroup: allGroupList,
    });
  } catch (e) {
    res.statusCode = 400;
    res.json({ msg: e.message });
  }
};
