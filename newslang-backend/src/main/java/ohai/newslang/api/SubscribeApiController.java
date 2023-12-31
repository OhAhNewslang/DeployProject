package ohai.newslang.api;

import lombok.RequiredArgsConstructor;
import ohai.newslang.configuration.jwt.TokenDecoder;
import ohai.newslang.domain.dto.request.ResultDto;
import ohai.newslang.domain.dto.request.RequestResult;
import ohai.newslang.domain.dto.subscribe.RequestSubscribeDto;
import ohai.newslang.domain.dto.subscribe.ResultSubscribeCategoryDto;
import ohai.newslang.domain.dto.subscribe.ResultSubscribeDto;
import ohai.newslang.domain.dto.subscribe.ResultSubscribeMediaDto;
import ohai.newslang.domain.entity.subscribe.MemberSubscribeItem;
import ohai.newslang.domain.entity.subscribe.SubscribeCategory;
import ohai.newslang.domain.entity.subscribe.SubscribeKeyword;
import ohai.newslang.domain.enumulate.SubscribeStatus;
import ohai.newslang.service.subscribe.MemberSubscribeItemService;
import ohai.newslang.service.subscribe.subscribeReference.CategoryService;
import ohai.newslang.service.subscribe.subscribeReference.MediaService;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/subscribe")
public class SubscribeApiController {

    private final MemberSubscribeItemService memberSubscribeItemService;
    private final MediaService mediaService;
    private final CategoryService categoryService;

    @GetMapping("/guest/media")
    public ResultSubscribeMediaDto getAllMedias() {
        return ResultSubscribeMediaDto.builder()
        .mediaList(mediaService.findAll())
        .result(RequestResult.builder()
        .resultCode("200")
        .resultMessage("언론사 목록 조회 성공").build())
        .build();
    }

    @GetMapping("/guest/category")
    public ResultSubscribeCategoryDto getAllCategories() {
        return ResultSubscribeCategoryDto.builder()
        .nameList(categoryService.findAll())
        .result(RequestResult.builder()
        .resultCode("200")
        .resultMessage("카테고리 목록 조회 성공").build())
        .build();
    }

    @GetMapping("/all")
    public ResultSubscribeDto getSubscribe(){
        MemberSubscribeItem memberSubscribeItem = memberSubscribeItemService
        .getMemberSubscribeItem();
        return ResultSubscribeDto.builder()
        .mediaList(memberSubscribeItem.getMemberSubscribeMediaItemList().stream()
        .map(m -> m.getMedia().getName()).collect(Collectors.toList()))
        .categoryList(memberSubscribeItem.getSubscribeCategoryList().stream()
        .map(SubscribeCategory::getName).collect(Collectors.toList()))
        .keywordList(memberSubscribeItem.getSubscribeKeywordList().stream()
        .map(SubscribeKeyword::getName).collect(Collectors.toList()))
        .mediaSubscribeStatus(memberSubscribeItem.getMediaSubscribeStatus())
        .categorySubscribeStatus(memberSubscribeItem.getCategorySubscribeStatus())
        .keywordSubscribeStatus(memberSubscribeItem.getKeywordSubscribeStatus())
        .result(RequestResult.builder().resultCode("200").resultMessage("구독 목록 조회 성공").build())
        .build();
    }

    @PostMapping("/media")
    public RequestResult subscribeMedia(
        @RequestBody @Valid RequestSubscribeDto request){
        return memberSubscribeItemService
        .updateSubscribeMediaItems(request.getNameList());
    }

    @PostMapping("/category")
    public RequestResult subscribeCategory(
        @RequestBody @Valid RequestSubscribeDto request){
        return memberSubscribeItemService
        .updateSubscribeCategory(request.getNameList());
    }

    @PostMapping("/keyword")
    public RequestResult subscribeKeyword(
        @RequestBody @Valid RequestSubscribeDto request){
        return memberSubscribeItemService
                .updateSubscribeKeyword(request.getNameList());
    }

    @PostMapping("/media/status")
    public RequestResult subscribeMediaStatus(
            @RequestParam("status") SubscribeStatus status){
        return memberSubscribeItemService
                .updateMediaSubscribeStatus(status);
    }

    @PostMapping("/category/status")
    public RequestResult subscribeCategoryStatus(
            @RequestParam("status") SubscribeStatus status){
        return memberSubscribeItemService
                .updateCategorySubscribeStatus(status);
    }

    @PostMapping("/keyword/status")
    public RequestResult subscribeKeywordStatus(
            @RequestParam("status") SubscribeStatus status){
        return memberSubscribeItemService
                .updateKeywordSubscribeStatus(status);
    }
}