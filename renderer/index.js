const { useState } = React;


function App() {
  const [ [ screen, data ], changeScreen ] = useState([]);
  const [ settingVisible, toggleSettingVisible ] = useState(false);
  const prevScreen = usePrevious(screen);
  const handleStart = _ => changeScreen(['start']);
  const handleLive = response => changeScreen(['dashboard', response]);
  const handleSetting = _ => toggleSettingVisible(true);
  const handleSettingBack = _ => toggleSettingVisible(false);

  const renderScreen = () => {
    switch (screen) {
      case 'start':
        return <StartScreen onLive={handleLive} onSetting={handleSetting} />;
      case 'dashboard':
        return <DashboardScreen data={data} onSetting={handleSetting} />;
      default:
        return <HomeScreen onStart={handleStart} onLive={handleLive} />;
    }
  };

  return (
    <React.Fragment>
      {renderScreen()}
      {settingVisible ? <SettingScreen onBack={handleSettingBack} /> : null}
    </React.Fragment>
  );
}

ReactDOM.render(<App />, document.getElementById('app'));
