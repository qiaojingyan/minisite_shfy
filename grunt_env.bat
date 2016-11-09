mkdir src
mklink /d Gruntfile.js ..\..\example\model1\Gruntfile.js
if not exist ..\..\js\tasks\node_modules (
mklink /d ..\..\js\tasks\node_modules ..\tool\node_modules
	)
mklink /d node_modules ..\..\js\tool\node_modules