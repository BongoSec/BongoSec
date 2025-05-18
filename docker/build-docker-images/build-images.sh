BONGOSEC_IMAGE_VERSION=5.0.0
BONGOSEC_VERSION=$(echo $BONGOSEC_IMAGE_VERSION | sed -e 's/\.//g')
BONGOSEC_TAG_REVISION=1
BONGOSEC_CURRENT_VERSION=$(curl --silent https://api.github.com/repos/bongosec/bongosec/releases/latest | grep '["]tag_name["]:' | sed -E 's/.*\"([^\"]+)\".*/\1/' | cut -c 2- | sed -e 's/\.//g')
IMAGE_VERSION=${BONGOSEC_IMAGE_VERSION}

# Bongosec package generator
# Copyright (C) 2023, Bongosec.
#
# This program is a free software; you can redistribute it
# and/or modify it under the terms of the GNU General Public
# License (version 2) as published by the FSF - Free Software
# Foundation.

BONGOSEC_IMAGE_VERSION="5.0.0"
BONGOSEC_TAG_REVISION="1"
BONGOSEC_DEV_STAGE=""
FILEBEAT_MODULE_VERSION="0.4"

# -----------------------------------------------------------------------------

trap ctrl_c INT

clean() {
    exit_code=$1

    exit ${exit_code}
}

ctrl_c() {
    clean 1
}

# -----------------------------------------------------------------------------


build() {

    BONGOSEC_VERSION="$(echo $BONGOSEC_IMAGE_VERSION | sed -e 's/\.//g')"
    FILEBEAT_TEMPLATE_BRANCH="${BONGOSEC_IMAGE_VERSION}"
    BONGOSEC_FILEBEAT_MODULE="bongosec-filebeat-${FILEBEAT_MODULE_VERSION}.tar.gz"
    BONGOSEC_UI_REVISION="${BONGOSEC_TAG_REVISION}"

    if  [ "${BONGOSEC_DEV_STAGE}" ];then
        FILEBEAT_TEMPLATE_BRANCH="v${FILEBEAT_TEMPLATE_BRANCH}-${BONGOSEC_DEV_STAGE,,}"
        if ! curl --output /dev/null --silent --head --fail "https://github.com/bongosec/bongosec/tree/${FILEBEAT_TEMPLATE_BRANCH}"; then
            echo "The indicated branch does not exist in the bongosec/bongosec repository: ${FILEBEAT_TEMPLATE_BRANCH}"
            clean 1
        fi
    else
        if curl --output /dev/null --silent --head --fail "https://github.com/bongosec/bongosec/tree/v${FILEBEAT_TEMPLATE_BRANCH}"; then
            FILEBEAT_TEMPLATE_BRANCH="v${FILEBEAT_TEMPLATE_BRANCH}"
        elif curl --output /dev/null --silent --head --fail "https://github.com/bongosec/bongosec/tree/${FILEBEAT_TEMPLATE_BRANCH}"; then
            FILEBEAT_TEMPLATE_BRANCH="${FILEBEAT_TEMPLATE_BRANCH}"
        else
            echo "The indicated branch does not exist in the bongosec/bongosec repository: ${FILEBEAT_TEMPLATE_BRANCH}"
            clean 1
        fi
    fi

    echo BONGOSEC_VERSION=$BONGOSEC_IMAGE_VERSION > .env
    echo BONGOSEC_IMAGE_VERSION=$BONGOSEC_IMAGE_VERSION >> .env
    echo BONGOSEC_TAG_REVISION=$BONGOSEC_TAG_REVISION >> .env
    echo FILEBEAT_TEMPLATE_BRANCH=$FILEBEAT_TEMPLATE_BRANCH >> .env
    echo BONGOSEC_FILEBEAT_MODULE=$BONGOSEC_FILEBEAT_MODULE >> .env
    echo BONGOSEC_UI_REVISION=$BONGOSEC_UI_REVISION >> .env

    docker-compose -f build-docker-images/build-images.yml --env-file .env build --no-cache || clean 1

    return 0
}

# -----------------------------------------------------------------------------

help() {
    echo
    echo "Usage: $0 [OPTIONS]"
    echo
    echo "    -d, --dev <ref>              [Optional] Set the development stage you want to build, example rc1 or beta1, not used by default."
    echo "    -f, --filebeat-module <ref>  [Optional] Set Filebeat module version. By default ${FILEBEAT_MODULE_VERSION}."
    echo "    -r, --revision <rev>         [Optional] Package revision. By default ${BONGOSEC_TAG_REVISION}"
    echo "    -v, --version <ver>          [Optional] Set the Bongosec version should be builded. By default, ${BONGOSEC_IMAGE_VERSION}."
    echo "    -h, --help                   Show this help."
    echo
    exit $1
}

# -----------------------------------------------------------------------------

main() {
    while [ -n "${1}" ]
    do
        case "${1}" in
        "-h"|"--help")
            help 0
            ;;
        "-d"|"--dev")
            if [ -n "${2}" ]; then
                BONGOSEC_DEV_STAGE="${2}"
                shift 2
            else
                help 1
            fi
            ;;
        "-f"|"--filebeat-module")
            if [ -n "${2}" ]; then
                FILEBEAT_MODULE_VERSION="${2}"
                shift 2
            else
                help 1
            fi
            ;;
        "-r"|"--revision")
            if [ -n "${2}" ]; then
                BONGOSEC_TAG_REVISION="${2}"
                shift 2
            else
                help 1
            fi
            ;;
        "-v"|"--version")
            if [ -n "$2" ]; then
                BONGOSEC_IMAGE_VERSION="$2"
                shift 2
            else
                help 1
            fi
            ;;
        *)
            help 1
        esac
    done

    build || clean 1

    clean 0
}

main "$@"
