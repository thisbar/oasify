const express = require('express')
const {json} = require("express");
const YAML = require("yaml");

const app = express()
const port = process.env.port || 3000

const fullDataType = (type) => {
	let dataType = type.toLowerCase();

	if (dataType === 'int') dataType = 'integer';
	if (dataType === 'bool') dataType = 'boolean';

	return dataType;
}
const guardParameterName = (name) => {
	return name.Parameter || name.Parameters;
}
app.use(json())
app.use(function (req, res, next) {
	res.header("Content-Type",'text/yaml');
	next();
});

app.post('/requestbody', function(req, res) {
	let OASRequestBody = req.body.map(key => {
		return {
			[guardParameterName(key)]: {
				required: key.Mandatory,
				description: `${key.Description}`,
				schema: {
					type: fullDataType(key.Type)
				}
			}
		}
	});

	res.send(YAML.stringify(OASRequestBody));
});

app.post('/parameters', function(req, res) {
	let OASQueryParameters = req.body.map(key => {
		return {
			in: 'query',
			name: guardParameterName(key),
			description: `${key.Description}`,
			required: key.Mandatory,
			type: fullDataType(key.Type)
		}
	});

	res.send(YAML.stringify(OASQueryParameters));
});

app.listen(port, () => {
	console.log(`Oasify app listening on port ${port}`)
})