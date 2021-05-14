let sonarqubeScanner = require('sonarqube-scanner');
const request = require('request');

const serverUrl = 'http://localhost:9000';
const token = 'c7f5b8a6d16b816c6a03cc01d19dfc6104439d91';
const projectKey = 'Atlant-M';

const checkServer = async () => {
  request(serverUrl, (error, response, body) => {
    if (error) {
      return false;
    } else {
      if (response.statusCode === 200) {
        clearInterval(check);
        setTimeout(() => {
          sonarqubeScanner(
            {
              serverUrl: serverUrl,
              token: token,
              options: {
                'sonar.projectKey': projectKey,
                'sonar.projectBaseDir': '.',
                'sonar.sources': '.',
                'sonar.sourceEncoding': 'UTF-8',
                'sonar.verbose': 'false',
                'sonar.exclusions':
                  './node_modules/*, ./ios/*, ./android/*, ./*.spec.t, ./sonarqube/*, **/*.java',
              },
            },
            () => {
              // callback
            },
          );
        }, 30 * 1000);
        return true;
      }
    }
  });
};

const check = setInterval(checkServer, 5000);
