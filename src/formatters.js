
const nunjucks = require("nunjucks");

const template = `

## Resource list
{% for category, resources in resourceList %}- [{{ category }}](#{{ category | lower | replace(" ", "-") | replace("(", "") | replace(")", "") }})
{% endfor %}

***

{% for category, resources in resourceList %}
### <a id="{{ category | lower | replace(" ", "-") | replace("(", "") | replace(")", "") }}"></a>{{ category }}
| Type | Name |
| --- | --- |
{% for resource in resources %}| {{ resource.type }} | {{ resource.name }} |
{% endfor %}
{% endfor %}
`;

const markdown = (resourceList) => {
    const env = new nunjucks.Environment();
    env.renderString(template, { resourceList });
}

exports.markdown = markdown;