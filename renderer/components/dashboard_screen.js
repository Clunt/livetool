const { useState, useEffect, useCallback } = React;
const { Row, Col, Form, Input, Select, Button, notification, Table } = antd;
const { SettingOutlined } = icons;

function DashboardScreen(props) {
  const { data } = props;
  const [ messageList, setMessageList ] = useState([]);
  const addMessage = message => setMessageList(list => {
    message = Object.assign({}, message, {
      createTime: (new Date(message.createTimestamp * 1000)).toLocaleTimeString()
    });
    speaker.speak(message);
    return message._history ? list.concat(message) : [message].concat(list);
  });

  useEffect(() => {
    livetoolBridge.ipc.getChartMessageHistory().then(message => {
      [].concat(message.room || []).map(i => ({
        message: i.text,
        userId: i.uid,
        userName: i.nickname,
        medalLevel: i.medal[0],
        medalName: i.medal[1],
        medalUserName: i.medal[2],
        medalRoomId: i.medal[3],
        createTimestamp: i.check_info.ts,
        _history: true,
      })).sort((a, b) => b.createTimestamp - a.createTimestamp).forEach(i => addMessage(i));
    });

    livetoolBridge.ipc.onChartMessage((event, msg, seq) => {
      switch (msg.cmd) {
        case 'DANMU_MSG': {
          const [ _, message, user, medal ] = msg.info;
          const [ userId, userName ] = user;
          const [ medalLevel, medalName, medalUserName, medalRoomId ] = medal;
          const createTimestamp = msg.info[9].ts;
          return addMessage({
            type: 'danmu',
            message,
            userId, userName,
            createTimestamp,
            medalLevel, medalName, medalUserName, medalRoomId,
            _msg: msg,
          });
        }
        case 'INTERACT_WORD': {
          const userId = msg.data.uid;
          const userName = msg.data.uname;
          const createTimestamp = msg.data.timestamp;
          return addMessage({
            type: 'interact',
            userId, userName,
            createTimestamp,
            _msg: msg,
          });
        }
        default:
          return console.log(msg, seq);
      }
    });
  }, []);

  const columns = [
    { title: '用户', key: 'userName', width: 180,
      render: message => {
        return (
          <span>
            {message.medalName ? `[${message.medalName}(${message.medalLevel})]` : ''}
            {message.userName}
            {/* ({message.userId}) */}
          </span>
        );
      },
    },
    { title: '弹幕', dataIndex: 'message' },
    { title: '时间', key: 'createTime', width: 120,
      render: message => {
        return (
          <span>{message.createTime}</span>
        );
      },
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ textAlign: 'center' }}>
        <h1>
          {data.userName}({data.roomId})
          <Button
            type="text"
            icon={<SettingOutlined />}
            onClick={props.onSetting}
            size="small"
          />
        </h1>
      </div>
      <div style={{ flex: 1, overflow: 'auto' }}>
        <Table
          sticky={true}
          columns={columns}
          dataSource={messageList}
          pagination={false}
          size="small"
        />
      </div>
    </div>
  );
}
