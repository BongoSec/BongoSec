# Bongosec Docker Copyright (C) 2017, Bongosec. (License GPLv2)
sleep 30
bash /usr/share/bongosec-indexer/plugins/opensearch-security/tools/securityadmin.sh -cd /usr/share/bongosec-indexer/opensearch-security/ -nhnv -cacert  $CACERT -cert $CERT -key $KEY -p 9200 -icl