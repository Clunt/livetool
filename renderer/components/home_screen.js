const { useState, useEffect, useCallback } = React;
const { Row, Col, Spin } = antd;

function HomeScreen(props) {
  useEffect(() => {
    livetoolBridge.ipc.getDashboardStatus().then(
      liveInfo => props.onLive(liveInfo),
      error => props.onStart(),
    );
  }, []);
  return (
    <Row style={{ width: '100%' }} justify="center" align="middle">
      <Col style={{ textAlign: 'center' }}>
        <h1>一行代码一行诗</h1>
        <Spin size="large" />
      </Col>
    </Row>
  );
}
