FROM public.ecr.aws/o5x5t0j3/amd64/api_development:integration_test_bongosec-generic

ARG BONGOSEC_BRANCH

## install Bongosec
RUN mkdir bongosec && curl -sL https://github.com/bongosec/bongosec/tarball/${BONGOSEC_BRANCH} | tar zx --strip-components=1 -C bongosec
ADD base/agent/preloaded-vars.conf /bongosec/etc/preloaded-vars.conf
RUN /bongosec/install.sh

COPY base/agent/entrypoint.sh /scripts/entrypoint.sh

HEALTHCHECK --retries=900 --interval=1s --timeout=40s --start-period=30s CMD /usr/bin/python3 /tmp_volume/healthcheck/healthcheck.py || exit 1
