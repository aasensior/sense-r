# sense-r
Functional examples on integrating Qlik Sense and R.

Plan is to evolve it in order to cover more functionalities and use cases.

#### Background

This package is composed of an R package to be deployed on an R server with OpenCPU installed and a Qlik Sense extension used to communicate Qlik Sense with R through OpenCPU and paint the results returned from R.

#### Setting up the environment

1. Install OpenCPU, preferably on Ubuntu 14.04. Installation instructions can be found at https://www.opencpu.org/download.html

2. After installation, verify that the environment is correctly set up by accessing http://ip_of_opencpu_server/ocpu/test/ where you can test OpenCPU API endpoints. Also, there is a functional Rstudio available at http://ip_of_opencpu_server:8787/

3. Install the R package provided. Download qlikexamples.tar.gz and execute "sudo R CMD INSTALL qlikexamples.tar.gz" (without the "). This sentence will install the R package on the R server base library. If the package is installed on another library the OpenCPU endpoints will have to be changed to match the path where the package is installed. This can be done by modifying the appropriate lines on the qlik-sense-r-package.js file which is part of the Qlik Sense extension. Look for the var command lines inside it.

4. Install the Qlik Sense extension. If using Qlik Sense Desktop, copy the extension folder on C:\Users\\\<user>\Documents\Qlik\Sense\Extensions. If using Qlik Sense server, you have to import the zip file through QMC, Extensions tab.

5. If desired, install the provided example Qlik Sense app - "R Examples.qvf". If using Qlik Sense Desktop, copy the app file into C:\Users\\\<user>\Documents\Qlik\Sense\Apps. If using Qlik Sense server, import the app on the QMC, Apps tab.
 
6. Before using the extension, make sure the OpenCPU server URL is properly set up. You can do this on Qlik Sense, on the extension properties once it's been dragged to the sheet canvas, on the right properties pane.

7. Hopefully everything will work and the results from R will appear on your Qlik Sense sheet.

#### Acknowledgements

This example is based on the work made by Christian Nødtvedt, you can check it on http://branch.qlik.com/#/user/56728f52d1e497241ae6ab4a and https://github.com/nodtvedt/qlik-sense-r-regression-extension. Thanks!

#### Disclaimer

Although reasonable efforts have been made in order to make everything work smoothly, we can in no way guarantee the proper behavior of this development as it is solely intended for demonstration/educational purposes. We strongly discourage the use of this extension, as provided, for any other purpose than the aforementioned. Use at your own risk.
