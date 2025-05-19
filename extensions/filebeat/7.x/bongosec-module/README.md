# Bongosec Filebeat module

## Hosting

The Bongosec Filebeat module is hosted at the following URLs

- Production:
  - https://packages.bongosec.github.io/4.x/filebeat/
- Development:
  - https://bongosec.github.io/packages/pre-release/filebeat/
  - https://bongosec.github.io/packages/staging/filebeat/

The Bongosec Filebeat module must follow the following nomenclature, where revision corresponds to X.Y values

- bongosec-filebeat-{revision}.tar.gz

Currently, we host the following modules

|Module|Version|
|:--|:--|
|bongosec-filebeat-0.1.tar.gz|From 3.9.x to 4.2.x included|
|bongosec-filebeat-0.2.tar.gz|From 4.3.x to 4.6.x included|
|bongosec-filebeat-0.3.tar.gz|4.7.x|
|bongosec-filebeat-0.4.tar.gz|From 4.8.x to current|


## How-To update module tar.gz file

To add a new version of the module it is necessary to follow the following steps:

1. Clone the bongosec/bongosec repository
2. Check out the branch that adds a new version
3. Access the directory: **extensions/filebeat/7.x/bongosec-module/**
4. Create a directory called: **bongosec**

```
# mkdir bongosec
```

5. Copy the resources to the **bongosec** directory

```
# cp -r _meta bongosec/
# cp -r alerts bongosec/
# cp -r archives bongosec/
# cp -r module.yml bongosec/
```

6. Set **root user** and **root group** to all elements of the **bongosec** directory (included)

```
# chown -R root:root bongosec
```

7. Set all directories with **755** permissions

```
# chmod 755 bongosec
# chmod 755 bongosec/alerts
# chmod 755 bongosec/alerts/config
# chmod 755 bongosec/alerts/ingest
# chmod 755 bongosec/archives
# chmod 755 bongosec/archives/config
# chmod 755 bongosec/archives/ingest
```

8. Set all yml/json files with **644** permissions

```
# chmod 644 bongosec/module.yml
# chmod 644 bongosec/_meta/config.yml
# chmod 644 bongosec/_meta/docs.asciidoc
# chmod 644 bongosec/_meta/fields.yml
# chmod 644 bongosec/alerts/manifest.yml
# chmod 644 bongosec/alerts/config/alerts.yml
# chmod 644 bongosec/alerts/ingest/pipeline.json
# chmod 644 bongosec/archives/manifest.yml
# chmod 644 bongosec/archives/config/archives.yml
# chmod 644 bongosec/archives/ingest/pipeline.json
```

9. Create **tar.gz** file

```
# tar -czvf bongosec-filebeat-0.4.tar.gz bongosec
```

10. Check the user, group, and permissions of the created file

```
# tree -pug bongosec
[drwxr-xr-x root     root    ]  bongosec
├── [drwxr-xr-x root     root    ]  alerts
│   ├── [drwxr-xr-x root     root    ]  config
│   │   └── [-rw-r--r-- root     root    ]  alerts.yml
│   ├── [drwxr-xr-x root     root    ]  ingest
│   │   └── [-rw-r--r-- root     root    ]  pipeline.json
│   └── [-rw-r--r-- root     root    ]  manifest.yml
├── [drwxr-xr-x root     root    ]  archives
│   ├── [drwxr-xr-x root     root    ]  config
│   │   └── [-rw-r--r-- root     root    ]  archives.yml
│   ├── [drwxr-xr-x root     root    ]  ingest
│   │   └── [-rw-r--r-- root     root    ]  pipeline.json
│   └── [-rw-r--r-- root     root    ]  manifest.yml
├── [drwxr-xr-x root     root    ]  _meta
│   ├── [-rw-r--r-- root     root    ]  config.yml
│   ├── [-rw-r--r-- root     root    ]  docs.asciidoc
│   └── [-rw-r--r-- root     root    ]  fields.yml
└── [-rw-r--r-- root     root    ]  module.yml
```

11. Upload file to development bucket
