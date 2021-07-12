const { useState, useEffect, useCallback } = React;
const { Row, Col, Form, Input, Select, Button, notification } = antd;
const { RightOutlined, SettingOutlined } = icons;

function StartScreen(props) {
  const [ liveInitialValues ] = useState({
    platform: livetoolBridge.store.get('live.platform'),
    roomId: livetoolBridge.store.get('live.roomId'),
  });

  const [ isStartLoading, toggleStartLoading ] = useState(false);
  const handleStart = useCallback(({ platform, roomId }) => {
    if (isStartLoading) {
      return;
    }
    toggleStartLoading(true);
    livetoolBridge.ipc.startLive({ platform, roomId }).then(response => {
      props.onLive(response);
      livetoolBridge.ipc.hideApp();
    }, error => {
      notification.error({ message: error.message });
      toggleStartLoading(false);
    });
  }, [isStartLoading]);

  return (
    <div style={{
      display: 'flex',
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
    }}>
      <Form initialValues={liveInitialValues} onFinish={handleStart} style={{ width: '64%' }} size="large">
        <Row justify="space-between" style={{ alignItems: 'baseline' }}>
          <h1>一行代码一行诗</h1>
          <span style={{ textAlign: 'right' }}>by Clunt</span>
        </Row>
        <Input.Group compact>
          <Form.Item name="platform" style={{ width: '24%' }} rules={[{ required: true, message: '' }]}>
            <Select placeholder="平台">
              <Select.Option value="bilibili">bilibili</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="roomId" style={{ width: '76%' }} rules={[{ required: true, message: '' }]}>
            <InputRoomId placeholder="房间ID" />
          </Form.Item>
        </Input.Group>
        <Row>
          <Col>
            <Button
              type="primary"
              icon={<RightOutlined />}
              htmlType="submit"
              loading={isStartLoading}
            >开始写诗</Button>
          </Col>
          <Col>
            <Button
              type="text"
              icon={<SettingOutlined />}
              onClick={props.onSetting}
            />
          </Col>
        </Row>
      </Form>
    </div>
  );

  function InputRoomId(props) {
    const { value, onChange } = props;
    const handleChange = event => {
      onChange(event.target.value.replace(/[^\d]/g, ''))
    };
    return (
      <Input {...props} value={value} onChange={handleChange} />
    );
  }
}
