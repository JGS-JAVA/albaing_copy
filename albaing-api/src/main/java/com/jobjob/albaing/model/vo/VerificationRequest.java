package com.jobjob.albaing.model.vo;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VerificationRequest {  // 디비가 아닌 자바객체 vo 에 저장하기 -> 매퍼 dao 레포지토리 필요없다

    private String email;
    private String code;
}
