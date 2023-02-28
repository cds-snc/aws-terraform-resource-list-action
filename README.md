# AWS Terraform resource list action

The purpose of this action is to read a Terraform state file, a `terraform graph` dot file, or a directory of terraform files, and to list and categorize the found AWS resources. This should provide a crude overview of the resources required by a specific set of infrastructure of code and should make it easier to get a quick assessment of what resources are used and what risks are associated with the use of those resources.

## Why would I want to do this?

It is very difficult to understand what types of assets your terraform code creates inside an AWS account. For example, a typical three tier application in AWS may have the following resources:

- Cloudfront
- Load Balancer
- ECS
- RDS
- VPC with NAT, Subnets, Security Groups, etc.

Looking at the Terraform files one might have a hard time figuring all that out. An alternative is to run `terraform graph` which will generate a dot file linking all your dependencies. Unfortunately, the GraphViz representation of that file is not user friendly or easily readable. Instead we can use this tool to create different outputs based on a simple categorization exercise. Each resource is categorized based on their membership inside the AWS Provider for Terraform (https://registry.terraform.io/providers/hashicorp/aws/latest/docs). And will output something like this (if you choose markdown as wour output):

### Sample output

#### Resource list
- [ACM (Certificate Manager)](#acm-certificate-manager)
- [CloudWatch Logs](#cloudwatch-logs)
- [DynamoDB](#dynamodb)
- [EC2 (Elastic Compute Cloud)](#ec2-elastic-compute-cloud)
- [ECR (Elastic Container Registry)](#ecr-elastic-container-registry)
- [ECS (Elastic Container)](#ecs-elastic-container)
- [ELB (Elastic Load Balancing)](#elb-elastic-load-balancing)
- [IAM (Identity &amp; Access Management)](#iam-identity-&amp;-access-management)
- [Route 53](#route-53)
- [Route 53 Resolver](#route-53-resolver)
- [VPC (Virtual Private Cloud)](#vpc-virtual-private-cloud)


***


##### <a id="acm-certificate-manager"></a>ACM (Certificate Manager)
| Type | Name |
| --- | --- |
| aws_acm_certificate | sre_bot |
| aws_acm_certificate_validation | sre_bot |


##### <a id="cloudwatch-logs"></a>CloudWatch Logs
| Type | Name |
| --- | --- |
| aws_cloudwatch_log_group | sre-bot_group |
| aws_cloudwatch_log_group | sre_bot_dns |
| aws_cloudwatch_log_group | flow_logs |
| aws_cloudwatch_log_resource_policy | route53_resolver_logging_policy |
| aws_cloudwatch_log_stream | sre-bot_stream |


##### <a id="dynamodb"></a>DynamoDB
| Type | Name |
| --- | --- |
| aws_dynamodb_table | aws_access_requests_table |
| aws_dynamodb_table | sre_bot_data |
| aws_dynamodb_table | webhooks_table |


##### <a id="ec2-elastic-compute-cloud"></a>EC2 (Elastic Compute Cloud)
| Type | Name |
| --- | --- |
| aws_eip | nat |


### <a id="ecr-elastic-container-registry"></a>ECR (Elastic Container Registry)
| Type | Name |
| --- | --- |
| aws_ecr_repository | sre-bot |


##### <a id="ecs-elastic-container"></a>ECS (Elastic Container)
| Type | Name |
| --- | --- |
| aws_ecs_cluster | sre-bot |
| aws_ecs_service | main |
| aws_ecs_task_definition | sre-bot |


##### <a id="elb-elastic-load-balancing"></a>ELB (Elastic Load Balancing)
| Type | Name |
| --- | --- |
| aws_lb | sre_bot |
| aws_lb_listener | sre_bot_listener |
| aws_lb_target_group | sre_bot |


##### <a id="iam-identity-&amp;-access-management"></a>IAM (Identity &amp; Access Management)
| Type | Name |
| --- | --- |
| aws_iam_policy | sre-bot_secrets_manager |
| aws_iam_policy | vpc_metrics_flow_logs_write_policy |
| aws_iam_role | sre-bot |
| aws_iam_role | flow_logs |
| aws_iam_role_policy_attachment | ecs_task_execution |
| aws_iam_role_policy_attachment | secrets_manager |
| aws_iam_role_policy_attachment | vpc_metrics_flow_logs_write_policy_attach |


##### <a id="route-53"></a>Route 53
| Type | Name |
| --- | --- |
| aws_route53_health_check | sre_bot_healthcheck |
| aws_route53_record | sre_bot |
| aws_route53_record | sre_bot_certificate_validation |
| aws_route53_zone | sre_bot |


##### <a id="route-53-resolver"></a>Route 53 Resolver
| Type | Name |
| --- | --- |
| aws_route53_resolver_query_log_config | sre_bot |
| aws_route53_resolver_query_log_config_association | sre_bot |


##### <a id="vpc-virtual-private-cloud"></a>VPC (Virtual Private Cloud)
| Type | Name |
| --- | --- |
| aws_default_network_acl | default |
| aws_default_route_table | default |
| aws_default_security_group | default |
| aws_flow_log | flow_logs |
| aws_internet_gateway | gw |
| aws_nat_gateway | nat_gw |
| aws_network_acl | main |
| aws_network_acl_rule | block_rdp |
| aws_network_acl_rule | block_ssh |
| aws_network_acl_rule | https_request_egress_443 |
| aws_network_acl_rule | https_request_in_ingress_443 |
| aws_network_acl_rule | https_request_in_ingress_ephemeral |
| aws_network_acl_rule | https_request_in_response_egress_443 |
| aws_network_acl_rule | https_request_in_response_egress_ephemeral |
| aws_network_acl_rule | https_request_out_egress_ephemeral |
| aws_network_acl_rule | https_request_out_response_ingress_443 |
| aws_network_acl_rule | https_request_out_response_ingress_ephemeral |
| aws_route | private_nat_gateway |
| aws_route | public_internet_gateway |
| aws_route_table | private |
| aws_route_table | public |
| aws_route_table_association | private |
| aws_route_table_association | public |
| aws_security_group | ecs_tasks |
| aws_security_group | sre_bot_load_balancer |
| aws_subnet | private |
| aws_subnet | public |
| aws_vpc | main |


### How do I use the action:

Here is an example of how you would use the action to post a comment into a PR based on some input

```
- name: Test State file
  id: ci-state-file
  uses: cds-snc/aws-terraform-resource-list-action@main
  with:
    terraform-state-path: ./test_fixtures/state.json
    output-format: markdown
- name: Comment on PR
  uses: thollander/actions-comment-pull-request@v2
  with:
    message: |
      #### Below is a list of the terraform assets
      <details>
        <summary>Terraform state test</summary>

        ${{ steps.ci-state-file.outputs.categorized-resources }}
      </details>
    comment_tag: summary-comment
    mode: recreate
```