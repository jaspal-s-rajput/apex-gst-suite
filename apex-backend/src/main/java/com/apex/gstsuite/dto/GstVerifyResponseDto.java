package com.apex.gstsuite.dto;

public class GstVerifyResponseDto {
    private String gstin;
    private boolean isValid;
    private String stateCode;
    private String stateName;
    private String pan;
    private String entityType;
    private String message;

    public GstVerifyResponseDto() {}

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private final GstVerifyResponseDto dto = new GstVerifyResponseDto();

        public Builder gstin(String gstin) { dto.gstin = gstin; return this; }
        public Builder isValid(boolean isValid) { dto.isValid = isValid; return this; }
        public Builder stateCode(String stateCode) { dto.stateCode = stateCode; return this; }
        public Builder stateName(String stateName) { dto.stateName = stateName; return this; }
        public Builder pan(String pan) { dto.pan = pan; return this; }
        public Builder entityType(String entityType) { dto.entityType = entityType; return this; }
        public Builder message(String message) { dto.message = message; return this; }
        public GstVerifyResponseDto build() { return dto; }
    }

    public String getGstin() { return gstin; }
    public void setGstin(String gstin) { this.gstin = gstin; }

    public boolean isValid() { return isValid; }
    public void setValid(boolean valid) { isValid = valid; }

    public String getStateCode() { return stateCode; }
    public void setStateCode(String stateCode) { this.stateCode = stateCode; }

    public String getStateName() { return stateName; }
    public void setStateName(String stateName) { this.stateName = stateName; }

    public String getPan() { return pan; }
    public void setPan(String pan) { this.pan = pan; }

    public String getEntityType() { return entityType; }
    public void setEntityType(String entityType) { this.entityType = entityType; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
