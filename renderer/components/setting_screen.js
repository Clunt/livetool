const { useState, useEffect, useCallback } = React;
const { Row, Col, Spin, Typography, Button } = antd;
const { EditOutlined, LeftOutlined } = icons;

function SettingScreen(props) {
  const [ setting, updateSetting ] = useState();
  useEffect(() => {
    livetoolBridge.ipc.getDashboardSetting().then(setting => {
      updateSetting(setting);
    });
  }, []);

  const setDashboardPort = port => {
    port = String(port).replace(/[^\d]/g, '');
    if (port) {
      updateSetting(setting => ({
        ...setting,
        port,
      }));
      livetoolBridge.ipc.updateDashboardPort(port);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      zIndex: 999,
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: '#fff',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <h1>设置/一行代码一行诗</h1>
      <div style={{ height: '200px' }}>
        {setting ? (
          <Row justify="center">
            <Typography.Paragraph>控制台端口：</Typography.Paragraph>
            <Typography.Paragraph
              copyable={{ text: `http://127.0.0.1:${setting.port}` }}
              editable={{
                icon: <EditOutlined />,
                onChange: setDashboardPort,
              }}
            >{String(setting.port)}</Typography.Paragraph>
          </Row>
        ) : <Spin size="large" /> }
      </div>
      <Button shape="circle" icon={<LeftOutlined />} onClick={props.onBack} />
    </div>
  );
}
