#!/bin/zsh

# Check if categories.json exists and get the version field
if [[ -f categories.json ]]; then
    current_version=$(jq -r '.version' categories.json)
fi

# Get latest release for AWS Terrafom provider
RELEASE_URL=$(curl -s -L https://api.github.com/repos/terraform-providers/terraform-provider-aws/releases/latest | jq -r '.zipball_url')
RELEASE_VERSION=$(echo $RELEASE_URL | cut -d'/' -f8)

# Only download and extract the provider if the current version is different from the latest release version
if [[ "$current_version" != "$RELEASE_VERSION" ]]; then

    echo "Downloading AWS terraform provider $RELEASE_VERSION"
    curl -s -L -o /tmp/terraform-provider-aws.zip $RELEASE_URL
    echo "Unzipping AWS terraform provider $RELEASE_VERSION"
    rm -rf /tmp/terraform-providers-terraform-provider-aws
    unzip -q /tmp/terraform-provider-aws.zip -d /tmp/terraform-providers-terraform-provider-aws

    # Get all the resources
    echo "Getting all resources markdown files"
    markdown_files=($(find /tmp/terraform-providers-terraform-provider-aws -type f -path "*/website/docs/r/*.markdown"))

    # Echo the length of the markdown_files array
    echo "Number of markdown files found: ${#markdown_files[@]}"

    # Start building the JSON object
    echo "Building JSON object"
    json_object="{\"version\":\"$RELEASE_VERSION\",\"resources\":{"

    # Loop through each markdown file and extract the page_title and subcategory
    for file in $markdown_files; do
        page_title=$(sed -n 's/^page_title: "AWS: \(.*\)"/\1/p' "$file")
        subcategory=$(sed -n 's/^subcategory: "\(.*\)"/\1/p' "$file")
        # echo "Processing ..."
        if [[ -n $page_title ]] && [[ -n $subcategory ]]; then
            json_object="${json_object}\"${page_title}\":\"${subcategory}\","
        fi
    done

    # Remove the trailing comma from the JSON object string
    json_object="${json_object%,}"

    # Close the JSON object string
    json_object="${json_object}}}"

    # Print the final JSON object
    echo "$json_object" > categories.json
    echo "Done!"

else
    echo "No new version found. $RELEASE_VERSION is the current vesion. Exiting..."
fi