import query from "utils/Query";
import Utils from "utils/Utils";
import { typeUser, typeGroup, typeMember } from "../../ts/type";

export default async (req, res) => {
  try {
    const name: string = req.body.name;
    const groupName: string = req.body.groupName;
    if (!name || !groupName) {
      throw new Error(`引数エラー[${name} : ${groupName}]`);
    }

    // ユーザID取得
    const user: typeUser[] = await query(
      "SELECT id FROM m_user WHERE name = ? LIMIT 1",
      [name]
    );

    if (!user) {
      throw new Error("存在しないユーザ");
    }

    const userId = user[0].id;

    // グループが存在するか
    let groupId: number;
    const group: typeGroup[] = await query(
      "SELECT id FROM m_group WHERE name = ? LIMIT 1",
      [groupName]
    );
    // 新規グループ作成
    if (!group) {
      let result: any = await query(
        "INSERT INTO m_group(`name`,`tag`,`created_at`,`updated_at`) VALUES(?,?,now(),now())",
        [groupName, Utils.getHash(groupName)]
      );
      groupId = result.insertId;
      // 初期スレッド
      const init_thread: string[] = ["general", "news", "random"];
      let sql_parts: string[] = [];
      let sql_data: any[] = [];
      init_thread.forEach((name) => {
        const hash = Utils.getHash(groupName + "_" + name);
        sql_parts.push(`(?,?,?,now(),now())`);
        sql_data = sql_data.concat([groupId, name, hash]);
      });
      let sql: string = sql_parts.join(",");
      await query(
        "INSERT INTO m_thread(`group_id`,`name`,`tag`,`created_at`,`updated_at`) VALUES " +
          sql,
        sql_data
      );
    } else {
      groupId = group[0].id;
    }

    // 既に所属しているか
    let is_member: typeMember[] = await query(
      "SELECT 1 FROM m_member WHERE group_id = ? and user_id = ?",
      [groupId, userId]
    );
    if (!is_member) {
      let result = await query(
        "INSERT INTO m_member(`group_id`,`user_id`,`created_at`,`updated_at`) VALUES(?,?,now(),now())",
        [groupId, userId]
      );
    }

    res.statusCode = 200;
    res.json({ msg: "success" });
  } catch (e) {
    res.statusCode = 400;
    res.json({ msg: e.message });
  }
};
