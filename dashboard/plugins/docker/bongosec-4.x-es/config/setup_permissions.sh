#/bin/sh

# X-Pack environment utility which:
#   - creates the "bongosec_app" user
#   - creates the "bongosec_indices" role
#   - maps the "bongosec_indices" role to the "bongosec_app" user

# Elasticsearch host
elasticsearch_admin="elastic"
elasticsearch_admin_password="SecretPassword"
elasticsearch_host="https://${1-localhost}:9200"

# User, roles and role mapping definition
bongosec_indices_role="bongosec_indices"
bongosec_indices_pattern="bongosec-*"
bongosec_user_username="bongosec_app"
bongosec_user_password="bongosec_app"
kibana_system_role="kibana_system"

exit_with_message(){
  echo $1;
  exit 1;
}

# Create "bongosec_indices" role
echo " Creating '$bongosec_indices_role' role..."
curl \
  -X POST \
  -H 'Content-Type: application/json' \
  -k -u $elasticsearch_admin:$elasticsearch_admin_password \
  $elasticsearch_host/_security/role/$bongosec_indices_role -d@- << EOF || exit_with_message "Error creating $bongosec_indices_role role"
{
  "cluster": [ "all" ],
  "indices": [
    {
      "names" : [ "$bongosec_indices_pattern" ],
      "privileges": [ "all" ]
    }
  ]
}
EOF
echo ""

# Create "bongosec_user" user
echo "Creating "$bongosec_user_username" user..."
curl \
  -X POST \
  -H 'Content-Type: application/json' \
  -k -u $elasticsearch_admin:$elasticsearch_admin_password \
  $elasticsearch_host/_security/user/$bongosec_user_username -d@- << EOF || exit_with_message "Error creating $bongosec_user_username user"
{
  "username" : "$bongosec_user_username",
  "password" : "$bongosec_user_password",
  "roles" : [ "$kibana_system_role", "$bongosec_indices_role" ],
  "full_name" : "",
  "email" : ""
}
EOF
echo ""
