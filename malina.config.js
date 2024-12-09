module.exports = function (option, filename) {
	option.css = false;
	option.passClass = false;
	option.immutable = true;
	option.plugins = [];
	option.autoimport = (name) => `import ${name} from './${name}.xht';`;
	return option;
};
